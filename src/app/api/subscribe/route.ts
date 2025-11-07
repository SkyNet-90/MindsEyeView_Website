import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return NextResponse.json({ message: 'Subscription reactivated!' })
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name: name || null,
        unsubscribeToken: uuidv4(),
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed!' })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
