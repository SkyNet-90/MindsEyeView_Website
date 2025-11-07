import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get photo to find file path
    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (photo) {
      // Delete file from filesystem
      try {
        const filepath = path.join(process.cwd(), 'public', photo.filePath)
        await unlink(filepath)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    // Delete from database
    await prisma.photo.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
