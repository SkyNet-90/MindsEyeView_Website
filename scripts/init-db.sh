#!/bin/sh
set -e

echo "🔧 Initializing database..."

# Push database schema
npm run db:push

echo "👤 Creating admin user if not exists..."

# Create admin user
node << 'NODEJS'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@mindseyeview.net';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const name = process.env.ADMIN_NAME || 'Admin';
    
    const existing = await prisma.adminUser.findUnique({ 
      where: { email: email } 
    });
    
    if (!existing) {
      const hash = await bcrypt.hash(password, 10);
      await prisma.adminUser.create({
        data: {
          email: email,
          name: name,
          passwordHash: hash
        }
      });
      console.log('✅ Admin user created:', email);
    } else {
      console.log('ℹ️  Admin user already exists:', email);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
NODEJS

echo "✅ Database initialization complete!"
