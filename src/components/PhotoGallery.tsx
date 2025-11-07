import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export async function PhotoGallery() {
  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  if (photos.length === 0) {
    return (
      <section className="py-20 bg-rock-light">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            <span className="text-primary-500">Photos</span>
          </h2>
          <div className="text-center text-gray-400">
            <p className="text-xl">Photo gallery coming soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-rock-light">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
          <span className="text-primary-500">Photos</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={photo.filePath}
                alt={photo.title || 'Band photo'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {photo.title && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <p className="text-white text-center font-semibold">{photo.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
