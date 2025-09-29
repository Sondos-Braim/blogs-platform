const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:YOUR_PASSWORD@db.sbmzjevyzlzacnhnhkez.supabase.co:5432/postgres?sslmode=require"
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes('ETIMEDOUT') || error.message.includes('ENOTFOUND')) {
      console.log('💡 Network issue: Cannot reach Supabase server');
      console.log('💡 Check your internet connection and firewall settings');
    }
    
    if (error.message.includes('password authentication')) {
      console.log('💡 Authentication issue: Check your password');
    }
  }
}

test();