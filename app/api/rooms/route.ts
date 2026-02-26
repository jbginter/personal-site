import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
  userId: z.string(), // In production, get from session
});

// GET /api/rooms - Get all rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const rooms = await prisma.room.findMany({
      where: userId ? {
        OR: [
          { isPrivate: false },
          { 
            members: {
              some: { userId }
            }
          }
        ]
      } : {
        isPrivate: false
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRoomSchema.parse(body);

    // In production, get userId from session
    const { userId, ...roomData } = validatedData;

    const room = await prisma.room.create({
      data: {
        ...roomData,
        createdById: userId,
        members: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms?roomId=xxx&userId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userId = searchParams.get('userId');

    if (!roomId || !userId) {
      return NextResponse.json(
        { error: 'Room ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check user permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
