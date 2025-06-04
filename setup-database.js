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
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
      // Filter out INSERT statements to preserve existing data
      .filter(statement => !statement.toUpperCase().includes('INSERT INTO'));

    // Execute each statement separately
    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log('Executed statement successfully');
      } catch (error) {
        // If the error is about table already existing, that's fine
        if (error.code === '42P07') {
          console.log('Table already exists, continuing...');
        } else {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    console.log('Database setup completed successfully!');
    console.log('\nDatabase structure has been updated while preserving existing data.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 