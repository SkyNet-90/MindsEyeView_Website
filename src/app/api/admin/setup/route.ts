import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// This route should be disabled in production or protected
export async function POST(request: Request) {
  try {
    const { email, password, name, setupKey } = await request.json()

    // Simple protection - only allow if setup key matches
    if (setupKey !== 'setup-mindseyeview-2024') {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      )
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // Delete existing admin if exists
    await prisma.adminUser.deleteMany({
      where: { email },
    })

    // Create new admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
