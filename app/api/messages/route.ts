import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const room = req.nextUrl.searchParams.get('room') ?? 'general';
  const since = req.nextUrl.searchParams.get('since');

  const params: unknown[] = [room];
  let sinceClause = '';
  if (since) {
    sinceClause = ' AND m.created_at > $2';
    params.push(since);
  }

  const { rows } = await pool.query(
    `SELECT m.id, m.content, m.created_at, m.deleted,
            u.id AS user_id, u.username, u.role
     FROM messages m
     JOIN users u ON m.user_id = u.id
     JOIN rooms  r ON m.room_id = r.id
     WHERE r.name = $1${sinceClause}
     ORDER BY m.created_at ASC
     LIMIT 200`,
    params
  );
  return NextResponse.json({ messages: rows });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, room = 'general' } = await req.json();
  if (!content?.trim() || content.length > 2000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  }

  const roomRes = await pool.query('SELECT id FROM rooms WHERE name = $1', [room]);
  if (!roomRes.rows[0]) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  const { rows } = await pool.query(
    'INSERT INTO messages (user_id, room_id, content) VALUES ($1, $2, $3) RETURNING id, content, created_at',
    [user.id, roomRes.rows[0].id, content.trim()]
  );
  return NextResponse.json({ message: { ...rows[0], user_id: user.id, username: user.username, role: user.role, deleted: false } });
}
