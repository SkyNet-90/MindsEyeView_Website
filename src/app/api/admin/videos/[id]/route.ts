import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Extract YouTube ID from URL
    let youtubeId = ''
    const url = data.youtubeUrl
    
    if (url.includes('youtube.com/watch?v=')) {
      youtubeId = url.split('v=')[1].split('&')[0]
    } else if (url.includes('youtube.com/shorts/')) {
      youtubeId = url.split('shorts/')[1].split('?')[0]
    } else if (url.includes('youtu.be/')) {
      youtubeId = url.split('youtu.be/')[1].split('?')[0]
    } else {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const video = await prisma.video.update({
      where: { id: parseInt(params.id) },
      data: {
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtubeUrl,
        youtubeId: youtubeId,
        isAcoustic: data.isAcoustic || false,
        displayOrder: data.displayOrder || 0,
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.video.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
