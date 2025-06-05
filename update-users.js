const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateUsers() {
  try {
    console.log('Updating user credentials...')

    // Update or create admin user
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: 'hjb1b172',
        role: 'admin'
      },
      create: {
        username: 'admin',
        password: 'hjb1b172',
        role: 'admin'
      }
    })
    console.log('Admin user updated:', adminUser)

    // Update or create regular user
    const regularUser = await prisma.user.upsert({
      where: { username: 'user' },
      update: {
        password: 'jll1b172',
        role: 'user'
      },
      create: {
        username: 'user',
        password: 'jll1b172',
        role: 'user'
      }
    })
    console.log('Regular user updated:', regularUser)

    console.log('\nUser credentials updated successfully!')
  } catch (error) {
    console.error('\nError updating users:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    await prisma.$disconnect()
  }
}

updateUsers() 