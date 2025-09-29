import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const supabaseUrl = databaseUrl.includes('sslmode=require') 
  ? databaseUrl 
  : `${databaseUrl}?sslmode=require`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: supabaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to Supabase database');
    
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection test passed');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    process.exit(1);
  }
}

testConnection();

export { prisma };