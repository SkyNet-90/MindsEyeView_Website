import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { UpcomingShows } from '@/components/UpcomingShows'
import { VideoGallery } from '@/components/VideoGallery'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-20 bg-rock-dark">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            About <span className="text-primary-500">Mind's Eye View</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/band-photo.jpg"
                alt="Mind's Eye View Band"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-300">
                Mind's Eye View is a six-piece high energy classic rock band playing music from the 60's through the 2000's. 
                They have been performing in the tri-state area since 2005.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                The band is now celebrating their <strong className="text-primary-400">20th anniversary</strong> together. 
                With a constantly updated set list, they are perfect for bars, weddings, corporate events, and private parties.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Bring your friends, grab a drink and prepare to rediscover the joy of live music.
              </p>
              <div className="pt-4">
                <Link 
                  href="/about"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <UpcomingShows limit={3} />

      {/* Video Gallery */}
      <VideoGallery limit={4} />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Book Mind's Eye View?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Make your next event unforgettable with high-energy classic rock
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary-900 font-bold px-10 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
