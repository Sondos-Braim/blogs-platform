import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 12);

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
      },
    }).catch(async (error) => {
      if (error.code === 'P2002') {
        console.log('⚠️  User already exists, using existing user...');
        return await prisma.user.findUnique({
          where: { email: 'test@example.com' }
        });
      }
      throw error;
    });

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    console.log('✅ User ready:', user.email);

    const post = await prisma.post.create({
      data: {
        title: 'Welcome to Our Blog Platform!',
        content: 'This is a sample post demonstrating our blogging platform features. You can create, edit, and delete your own blog posts after signing up.',
        published: true,
        authorId: user.id,
      },
    });

    console.log('✅ Sample post created:', post.title);

    const additionalPosts = await Promise.all([
      prisma.post.create({
        data: {
          title: 'Getting Started with Blogging',
          content: 'Learn how to create your first blog post and share your thoughts with the world.',
          published: true,
          authorId: user.id,
        },
      }),
      prisma.post.create({
        data: {
          title: 'The Future of Content Creation',
          content: 'Exploring new trends and technologies in the world of blogging and content creation.',
          published: false,
          authorId: user.id,
        },
      }),
    ]);

    console.log(`✅ Created ${additionalPosts.length} additional posts`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });