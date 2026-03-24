import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { rows } = await pool.query('SELECT user_id FROM messages WHERE id = $1 AND deleted = FALSE', [id]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const canDelete =
    rows[0].user_id === user.id ||
    user.role === 'admin' ||
    user.role === 'moderator';

  if (!canDelete) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await pool.query('UPDATE messages SET deleted = TRUE WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
