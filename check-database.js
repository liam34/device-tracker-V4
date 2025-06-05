const { Pool } = require('pg');

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    // Test connection
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('Successfully connected to the database!');

    // Get database information
    const dbInfo = await client.query('SELECT current_database(), current_user, version()');
    console.log('\nDatabase Information:');
    console.log('---------------------');
    console.log(`Database: ${dbInfo.rows[0].current_database}`);
    console.log(`User: ${dbInfo.rows[0].current_user}`);
    console.log(`PostgreSQL Version: ${dbInfo.rows[0].version}`);

    // List all tables
    console.log('\nTables in database:');
    console.log('------------------');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tables.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      tables.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }

    // For each table, show its structure
    console.log('\nTable Structures:');
    console.log('----------------');
    for (const table of tables.rows) {
      console.log(`\nStructure of ${table.table_name}:`);
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table.table_name]);
      
      columns.rows.forEach(column => {
        console.log(`- ${column.column_name}: ${column.data_type} ${column.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${column.column_default ? `default: ${column.column_default}` : ''}`);
      });
    }

    // Check for indexes
    console.log('\nIndexes:');
    console.log('--------');
    const indexes = await client.query(`
      SELECT 
        tablename, 
        indexname, 
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);
    
    if (indexes.rows.length === 0) {
      console.log('No indexes found.');
    } else {
      indexes.rows.forEach(index => {
        console.log(`\nTable: ${index.tablename}`);
        console.log(`Index: ${index.indexname}`);
        console.log(`Definition: ${index.indexdef}`);
      });
    }

    client.release();
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase(); 