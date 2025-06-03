const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // Connect to the default 'postgres' database to create 'devicetrackerDB' if needed
  const adminPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'liam34',
    ssl: false
  });

  try {
    // Try to create the database (will error if it already exists, which is fine)
    await adminPool.query("CREATE DATABASE \"devicetrackerDB\"");
    console.log('Database created successfully');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database already exists, continuing...');
    } else {
      console.error('Error creating database:', error);
      await adminPool.end();
      return;
    }
  }
  await adminPool.end();

  // Now connect to the new database to run the schema
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'devicetrackerDB',
    user: 'postgres',
    password: 'liam34',
    ssl: false
  });

  try {
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    // Execute the schema
    await pool.query(schema);
    console.log('Database setup completed successfully!');
    console.log('\nDefault users created:');
    console.log('Admin - username: admin, password: admin123');
    console.log('User - username: user, password: user123');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 