import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  roomId: z.string(),
  userId: z.string(), // In production, get from session
});

// GET /api/messages?roomId=xxx - Get messages for a room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        roomId,
        ...(before && {
          createdAt: {
            lt: new Date(before),
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Reverse to show oldest first
    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Check if user is muted in this room
    const mute = await prisma.roomMute.findUnique({
      where: {
        roomId_userId: {
          roomId: validatedData.roomId,
          userId: validatedData.userId,
        },
      },
    });

    if (mute && (!mute.expiresAt || mute.expiresAt > new Date())) {
      return NextResponse.json(
        { error: 'You are muted in this room' },
        { status: 403 }
      );
    }

    // Check if user is banned from this room
    const ban = await prisma.roomBan.findUnique({
      where: {
        roomId_userId: {
          roomId: validatedData.roomId,
          userId: validatedData.userId,
        },
      },
    });

    if (ban) {
      return NextResponse.json(
        { error: 'You are banned from this room' },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    // Update room member last seen
    await prisma.roomMember.upsert({
      where: {
        roomId_userId: {
          roomId: validatedData.roomId,
          userId: validatedData.userId,
        },
      },
      update: {
        lastSeen: new Date(),
      },
      create: {
        roomId: validatedData.roomId,
        userId: validatedData.userId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages?messageId=xxx&userId=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId');

    if (!messageId || !userId) {
      return NextResponse.json(
        { error: 'Message ID and User ID are required' },
        { status: 400 }
      );
    }

    // Get message and user
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!message || !user) {
      return NextResponse.json(
        { error: 'Message or user not found' },
        { status: 404 }
      );
    }

    // Check permissions: own message or admin/moderator
    if (
      message.userId !== userId &&
      user.role !== 'ADMIN' &&
      user.role !== 'MODERATOR'
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
