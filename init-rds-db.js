const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  // First connect to the default 'postgres' database
  const adminPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    // Create the database if it doesn't exist
    await adminPool.query("CREATE DATABASE \"device-tracker-database-1\"");
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

  // Now connect to our new database to create tables
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL.replace('/postgres', '/device-tracker-database-1'),
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    // Read and execute the schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log('Executed statement successfully');
      } catch (error) {
        if (error.code === '42P07') {
          console.log('Table already exists, continuing...');
        } else {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    // Add initial admin user
    await pool.query(`
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
    `, ['admin', 'admin123', 'admin']);

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase(); 