import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@mindseyeview.net'
  const password = 'password123'
  const name = 'Admin'

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)
  
  console.log('Creating admin user...')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Hash:', passwordHash)

  // Delete existing admin if exists
  await prisma.adminUser.deleteMany({
    where: { email }
  })

  // Create new admin
  const admin = await prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash,
    },
  })

  console.log('\nAdmin user created successfully!')
  console.log('ID:', admin.id)
  console.log('Email:', admin.email)
  console.log('Name:', admin.name)
  
  // Test the password
  const isValid = await bcrypt.compare(password, admin.passwordHash)
  console.log('Password verification:', isValid ? '✓ PASS' : '✗ FAIL')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
