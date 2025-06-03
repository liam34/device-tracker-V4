import { Pool } from 'pg'

// Parse the DATABASE_URL to get individual components
const parseDatabaseUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '5432'),
      database: parsed.pathname.slice(1),
      user: parsed.username,
      password: parsed.password,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error)
    throw new Error('Invalid DATABASE_URL format')
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create a new pool instance with parsed configuration
const pool = new Pool(parseDatabaseUrl(process.env.DATABASE_URL))

// Test the connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Helper function to execute queries with proper error handling
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  } finally {
    client.release()
  }
}

// Helper function to execute a single row query
export async function queryOne(text: string, params?: any[]) {
  try {
    const rows = await query(text, params)
    return rows[0] || null
  } catch (error) {
    console.error('Error executing queryOne:', error)
    throw error
  }
}

// Export the pool for direct access if needed
export { pool } 