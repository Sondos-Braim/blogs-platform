import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = databaseUrl?.includes('sslmode=require') 
  ? databaseUrl 
  : `${databaseUrl}?sslmode=require`;

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    datasources: {
      db: {
        url: supabaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

prisma.$connect()
  .then(() => {
    console.log('Connected to Supabase database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });