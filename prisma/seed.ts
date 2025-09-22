import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      hashedPassword,
      ratingAverage: 4.5,
      ratingCount: 10,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      hashedPassword,
      ratingAverage: 4.8,
      ratingCount: 15,
    },
  });

  // Create demo items
  await prisma.item.createMany({
    data: [
      {
        title: 'Electric Drill',
        description: 'Cordless drill with battery pack. Perfect for home projects.',
        category: 'Tools',
        exchangeType: 'BORROW',
        photos: [],
        lat: 40.7128,
        lng: -74.0060,
        ownerId: user1.id,
      },
      {
        title: 'Garden Hose',
        description: '50ft garden hose in excellent condition.',
        category: 'Garden',
        exchangeType: 'GIVE',
        photos: [],
        lat: 40.7589,
        lng: -73.9851,
        ownerId: user2.id,
      },
      {
        title: 'Board Games Collection',
        description: 'Various board games including Monopoly, Scrabble, and more.',
        category: 'Entertainment',
        exchangeType: 'TRADE',
        tradeFor: 'Books or puzzles',
        photos: [],
        lat: 40.7505,
        lng: -73.9934,
        ownerId: user1.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });