const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Push the schema to the database
    console.log('\nPushing schema to database...')
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    // Generate Prisma Client
    console.log('\nGenerating Prisma Client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // Create initial admin user
    console.log('\nCreating initial admin user...')
    const prisma = new PrismaClient()
    await prisma.user.create({
      data: {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      }
    })
    
    console.log('\nDatabase initialization completed successfully!')
  } catch (error) {
    console.error('\nError initializing database:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

initializeDatabase() 