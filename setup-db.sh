#!/bin/bash

echo "🚀 Setting up Chatroom Database..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update DATABASE_URL in .env.local with your database credentials"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

# Push schema to database
echo "🗄️  Pushing schema to database..."
npm run db:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Test credentials:"
echo "  Admin: admin@example.com / admin123"
echo "  Moderator: mod@example.com / mod123"
echo "  User: user@example.com / user123"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start development server"
echo "  2. Visit http://localhost:3000/chatroom"
echo "  3. Run 'npm run db:studio' to open Prisma Studio"
echo ""
