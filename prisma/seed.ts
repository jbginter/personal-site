import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const modPassword = await bcrypt.hash('mod123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const moderator = await prisma.user.upsert({
    where: { email: 'mod@example.com' },
    update: {},
    create: {
      email: 'mod@example.com',
      username: 'Moderator',
      passwordHash: modPassword,
      role: 'MODERATOR',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'User123',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log('Created users:', { admin, moderator, user });

  // Create rooms
  const generalRoom = await prisma.room.create({
    data: {
      name: 'General',
      description: 'General discussion for everyone',
      isPrivate: false,
      createdById: admin.id,
    },
  });

  const techRoom = await prisma.room.create({
    data: {
      name: 'Tech Talk',
      description: 'Discuss technology and development',
      isPrivate: false,
      createdById: admin.id,
    },
  });

  const privateRoom = await prisma.room.create({
    data: {
      name: 'Admin Only',
      description: 'Private room for administrators',
      isPrivate: true,
      createdById: admin.id,
    },
  });

  console.log('Created rooms:', { generalRoom, techRoom, privateRoom });

  // Add some messages
  await prisma.message.createMany({
    data: [
      {
        content: 'Welcome to the General chat!',
        roomId: generalRoom.id,
        userId: admin.id,
      },
      {
        content: 'Hey everyone!',
        roomId: generalRoom.id,
        userId: user.id,
      },
      {
        content: 'Let\'s talk about Next.js and React',
        roomId: techRoom.id,
        userId: moderator.id,
      },
    ],
  });

  console.log('Created sample messages');

  // Add room members
  await prisma.roomMember.createMany({
    data: [
      { roomId: generalRoom.id, userId: admin.id },
      { roomId: generalRoom.id, userId: moderator.id },
      { roomId: generalRoom.id, userId: user.id },
      { roomId: techRoom.id, userId: admin.id },
      { roomId: techRoom.id, userId: moderator.id },
      { roomId: privateRoom.id, userId: admin.id },
    ],
  });

  console.log('Added room members');

  console.log('✅ Database seed completed!');
  console.log('\nTest credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Moderator: mod@example.com / mod123');
  console.log('User: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
