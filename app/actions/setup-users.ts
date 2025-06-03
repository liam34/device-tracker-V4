// 'use server'

// // import { neon } from '@neondatabase/serverless'

// export async function setupUsers() {
//   try {
//     const sql = neon(process.env.DATABASE_URL!)

//     // Drop existing table if it exists
//     await sql`DROP TABLE IF EXISTS users`

//     // Create users table
//     await sql`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(50) UNIQUE NOT NULL,
//         password VARCHAR(100) NOT NULL,
//         role VARCHAR(20) NOT NULL,
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       )
//     `

//     // Add users
//     await sql`
//       INSERT INTO users (username, password, role) VALUES 
//       ('admin', 'Jlladmin2022', 'admin'),
//       ('user1', 'Jll1user2022', 'user'),
//       ('user2', 'Jll2user2022', 'user')
//       ON CONFLICT (username) DO NOTHING
//     `

//     return {
//       success: true,
//       message: 'Users setup completed successfully'
//     }
//   } catch (error) {
//     console.error('Error setting up users:', error)
//     return {
//       success: false,
//       message: 'Failed to set up users',
//       error: error instanceof Error ? error.message : String(error)
//     }
//   }
// } 