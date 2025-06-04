const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function updateDatabase() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'devicetrackerDB',
    user: 'postgres',
    password: 'liam34',
    ssl: false
  });

  try {
    // 1. Backup existing data
    console.log('Backing up existing devices...');
    const backupData = await pool.query('SELECT * FROM devices');
    
    // Save backup to file
    const backupPath = path.join(__dirname, 'devices_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData.rows, null, 2));
    console.log('Backup saved to devices_backup.json');

    // 2. Drop existing table
    console.log('Dropping existing devices table...');
    await pool.query('DROP TABLE IF EXISTS devices CASCADE');
    console.log('Devices table dropped successfully');

    // 3. Read and execute the updated schema
    console.log('Creating new devices table with updated schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('New schema applied successfully');

    // 4. Restore data with validation
    console.log('Restoring device data...');
    for (const device of backupData.rows) {
      try {
        // Validate device_id format
        if (!/^[A-Za-z0-9-]+$/.test(device.device_id)) {
          console.warn(`Skipping device ${device.device_id} - invalid format`);
          continue;
        }

        await pool.query(`
          INSERT INTO devices (
            device_id,
            device_type,
            building,
            area,
            status,
            assigned_to,
            notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (device_id) DO NOTHING
        `, [
          device.device_id,
          device.device_type,
          device.building,
          device.area,
          device.status,
          device.assigned_to,
          device.notes
        ]);
      } catch (error) {
        console.error(`Error restoring device ${device.device_id}:`, error.message);
      }
    }

    console.log('Database update completed successfully!');
    console.log('\nNote: A backup of your original data has been saved to devices_backup.json');

  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await pool.end();
  }
}

updateDatabase(); 