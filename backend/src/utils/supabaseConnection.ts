import { PrismaClient } from '@prisma/client';

// Parse the DATABASE_URL to add SSL requirement
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Add SSL requirement for Supabase
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

// Test connection on startup
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to Supabase database');
    
    // Test with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection test passed');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    process.exit(1);
  }
}

// Run connection test
testConnection();

export { prisma };