import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const moderationSchema = z.object({
  roomId: z.string(),
  targetUserId: z.string(),
  moderatorId: z.string(), // In production, get from session
  reason: z.string().optional(),
});

// Helper function to check moderator permissions
async function checkModeratorPermissions(
  moderatorId: string,
  requiredRole: 'MODERATOR' | 'ADMIN'
) {
  const user = await prisma.user.findUnique({
    where: { id: moderatorId },
    select: { role: true },
  });

  if (!user) return false;
  
  if (requiredRole === 'ADMIN') {
    return user.role === 'ADMIN';
  }
  
  return user.role === 'ADMIN' || user.role === 'MODERATOR';
}

// POST /api/moderation/ban - Ban a user from a room
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = moderationSchema.parse(body);

    switch (action) {
      case 'ban':
        return await handleBan(validatedData);
      case 'unban':
        return await handleUnban(validatedData);
      case 'mute':
        return await handleMute(validatedData);
      case 'unmute':
        return await handleUnmute(validatedData);
      case 'kick':
        return await handleKick(validatedData);
      case 'clear':
        return await handleClearMessages(validatedData);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in moderation:', error);
    return NextResponse.json(
      { error: 'Moderation action failed' },
      { status: 500 }
    );
  }
}

async function handleBan(data: z.infer<typeof moderationSchema>) {
  // Only admins can ban
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'ADMIN');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Only admins can ban users' },
      { status: 403 }
    );
  }

  // Create ban record
  const ban = await prisma.roomBan.create({
    data: {
      roomId: data.roomId,
      userId: data.targetUserId,
      reason: data.reason,
    },
  });

  // Remove user from room members
  await prisma.roomMember.deleteMany({
    where: {
      roomId: data.roomId,
      userId: data.targetUserId,
    },
  });

  // Delete user's messages in the room
  await prisma.message.deleteMany({
    where: {
      roomId: data.roomId,
      userId: data.targetUserId,
    },
  });

  return NextResponse.json({ success: true, ban });
}

async function handleUnban(data: z.infer<typeof moderationSchema>) {
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'ADMIN');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Only admins can unban users' },
      { status: 403 }
    );
  }

  await prisma.roomBan.delete({
    where: {
      roomId_userId: {
        roomId: data.roomId,
        userId: data.targetUserId,
      },
    },
  });

  return NextResponse.json({ success: true });
}

async function handleMute(data: z.infer<typeof moderationSchema>) {
  // Admins and moderators can mute
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'MODERATOR');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Insufficient permissions to mute users' },
      { status: 403 }
    );
  }

  const mute = await prisma.roomMute.create({
    data: {
      roomId: data.roomId,
      userId: data.targetUserId,
      // Optional: set expiration time
      // expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    },
  });

  return NextResponse.json({ success: true, mute });
}

async function handleUnmute(data: z.infer<typeof moderationSchema>) {
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'MODERATOR');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Insufficient permissions to unmute users' },
      { status: 403 }
    );
  }

  await prisma.roomMute.delete({
    where: {
      roomId_userId: {
        roomId: data.roomId,
        userId: data.targetUserId,
      },
    },
  });

  return NextResponse.json({ success: true });
}

async function handleKick(data: z.infer<typeof moderationSchema>) {
  // Admins and moderators can kick
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'MODERATOR');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Insufficient permissions to kick users' },
      { status: 403 }
    );
  }

  // Remove user from room members (they can rejoin)
  await prisma.roomMember.deleteMany({
    where: {
      roomId: data.roomId,
      userId: data.targetUserId,
    },
  });

  // Delete user's recent messages (optional - you can keep or remove)
  await prisma.message.deleteMany({
    where: {
      roomId: data.roomId,
      userId: data.targetUserId,
    },
  });

  return NextResponse.json({ success: true });
}

async function handleClearMessages(data: z.infer<typeof moderationSchema>) {
  // Only admins can clear all messages
  const hasPermission = await checkModeratorPermissions(data.moderatorId, 'ADMIN');
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Only admins can clear all messages' },
      { status: 403 }
    );
  }

  await prisma.message.deleteMany({
    where: {
      roomId: data.roomId,
    },
  });

  return NextResponse.json({ success: true });
}

// GET /api/moderation?roomId=xxx - Get bans and mutes for a room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const [bans, mutes] = await Promise.all([
      prisma.roomBan.findMany({
        where: { roomId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      prisma.roomMute.findMany({
        where: { roomId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ bans, mutes });
  } catch (error) {
    console.error('Error fetching moderation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moderation data' },
      { status: 500 }
    );
  }
}
