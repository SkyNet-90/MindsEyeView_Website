import { Metadata } from 'next'
import { VideoGallery } from '@/components/VideoGallery'
import { PhotoGallery } from '@/components/PhotoGallery'

export const metadata: Metadata = {
  title: 'Gallery',
  description: "View photos and videos of Mind's Eye View performances. Watch our live shows and see the energy we bring to every event.",
}

import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  return (
    <div className="bg-rock-dark min-h-screen py-20">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-center mb-6">
          <span className="text-primary-500">Gallery</span>
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
          Check out our performances and get a taste of the high-energy classic rock experience we deliver at every show.
        </p>
      </div>

      <VideoGallery />
      <PhotoGallery />
    </div>
  )
}
