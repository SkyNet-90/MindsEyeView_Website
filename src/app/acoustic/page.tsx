import { Metadata } from 'next'
import Image from 'next/image'
import { VideoGallery } from '@/components/VideoGallery'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Acoustic Duo',
  description: "Mind's Eye View acoustic duo featuring Sean Bradley and Mike Markiewicz playing classic acoustic hits.",
}

export default function AcousticPage() {
  return (
    <div className="bg-rock-dark min-h-screen">
      <section className="py-20 bg-gradient-to-b from-rock-darker to-rock-dark">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-12 text-center">
            Mind's Eye View <span className="text-primary-500">Acoustic</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/sean-mike-acoustic.jpg"
                alt="Sean Bradley and Mike Markiewicz - Acoustic Duo"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="space-y-6">
              <p className="text-xl text-gray-300">
                Mind's Eye View acoustic band consists of 2 members from our full band,{' '}
                <strong className="text-white">Sean Bradley and Mike Markiewicz</strong>.
              </p>
              <p className="text-xl text-gray-300">
                We play classic acoustic hits that resonate with all ages. When our acoustic duo performs 
                at your event, you can be sure everyone will recognize and love the music.
              </p>
              <div className="pt-4">
                <a
                  href="/contact"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors shadow-xl"
                >
                  Book Our Acoustic Duo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoGallery acousticOnly={true} />

      <section className="py-20 bg-rock-darker">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            Perfect for <span className="text-primary-500">Intimate Settings</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-300">
            <div className="bg-rock-light p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Ideal For:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Cocktail hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Restaurant performances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Private parties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Corporate events</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Outdoor gatherings</span>
                </li>
              </ul>
            </div>
            <div className="bg-rock-light p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Acoustic:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Intimate, engaging performances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Perfect volume for conversation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Familiar, beloved classics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Flexible setup options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Professional, experienced musicians</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
