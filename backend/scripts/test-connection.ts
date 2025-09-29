import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔗 Testing Supabase database connection...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Database URL:', databaseUrl.replace(/:[^:]*@/, ':********@')); // Hide password

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.includes('sslmode=require') 
          ? databaseUrl 
          : `${databaseUrl}?sslmode=require`,
      },
    },
    log: ['info'],
  });

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    // Test with a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database version query successful');
    console.log('PostgreSQL Version:', result);

    // Check if we can query the database schema
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Database schema query successful');
    console.log('Available tables:', tables);

    await prisma.$disconnect();
    console.log('✅ All connection tests passed!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('SSL')) {
      console.log('💡 Tip: Supabase requires SSL. Make sure your connection string includes ?sslmode=require');
    }
    
    if (error.message.includes('password authentication')) {
      console.log('💡 Tip: Check your Supabase password in the connection string');
    }
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Tip: The database might not exist. Check your Supabase project settings');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();