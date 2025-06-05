const { Pool } = require('pg');

async function testConnection() {
  // Log the DATABASE_URL (with password masked)
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in environment variables');
    return;
  }

  // Mask the password in the URL for logging
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('Attempting to connect to:', maskedUrl);

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    console.log('\nTesting connection...');
    const client = await pool.connect();
    
    // Test query
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('\nConnection successful!');
    console.log('Database:', result.rows[0].current_database);
    console.log('User:', result.rows[0].current_user);
    console.log('PostgreSQL Version:', result.rows[0].version);

    client.release();
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await pool.end();
  }
}

testConnection(); 