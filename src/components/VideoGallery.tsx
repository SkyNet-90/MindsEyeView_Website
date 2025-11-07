import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface VideoGalleryProps {
  limit?: number
  acousticOnly?: boolean
}

export async function VideoGallery({ limit, acousticOnly }: VideoGalleryProps) {
  const videos = await prisma.video.findMany({
    where: acousticOnly !== undefined ? { isAcoustic: acousticOnly } : undefined,
    orderBy: {
      displayOrder: 'asc',
    },
    take: limit || 20,
  })

  return (
    <section className="py-20 bg-rock-darker">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
          {acousticOnly ? 'Acoustic ' : ''}
          <span className="text-primary-500">Videos</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {videos.map((video) => (
            <div key={video.id} className="rounded-lg overflow-hidden shadow-xl">
              <div className="relative pb-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              {video.description && (
                <div className="bg-rock-light p-4">
                  <p className="text-gray-300">{video.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {limit && videos.length >= limit && (
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Videos
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
