import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      youtubeId = url.split('shorts/')[1].split('?')[0].split('&')[0]
    } else if (url.includes('youtu.be/')) {
      youtubeId = url.split('youtu.be/')[1].split('?')[0].split('&')[0]
    } else {
      return NextResponse.json({ error: 'Invalid YouTube URL format' }, { status: 400 })
    }

    if (!youtubeId || youtubeId.length === 0) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title: data.title || '',
        description: data.description || '',
        youtubeUrl: data.youtubeUrl,
        youtubeId: youtubeId,
        isAcoustic: data.isAcoustic || false,
        displayOrder: data.displayOrder || 0,
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ error: `Failed to create video: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
  }
}
