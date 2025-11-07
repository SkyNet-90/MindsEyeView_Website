const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@mindseyeview.net';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    const admin = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name: 'Admin',
      },
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nPlease change this password after first login!');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
