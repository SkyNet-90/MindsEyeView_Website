import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about Mind's Eye View - a high energy classic rock band celebrating 20 years of performances in the tri-state area.",
}

export default function AboutPage() {
  return (
    <div className="py-20 bg-rock-dark">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-center mb-12">
          About <span className="text-primary-500">Mind's Eye View</span>
        </h1>

        <div className="mb-12">
          <div className="rounded-lg overflow-hidden shadow-2xl mb-8">
            <Image
              src="/images/band-photo.jpg"
              alt="Mind's Eye View Band"
              width={1080}
              height={608}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="space-y-6 text-lg text-gray-300 max-w-4xl mx-auto">
            <p>
              <strong className="text-white">Mind's Eye View</strong> is a six-piece high energy classic rock band 
              playing music from the 60's through the 2000's. They have been performing in the tri-state area 
              since 2005.
            </p>
            <p>
              The band is now celebrating their <strong className="text-primary-400">20th anniversary</strong> together. 
              With a constantly updated set list, they are perfect for bars, weddings, corporate events, and private parties.
            </p>
            <p>
              Bring your friends, grab a drink and prepare to rediscover the joy of live music with Mind's Eye View!
            </p>
          </div>
        </div>

        <div className="bg-rock-light rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-display font-bold mb-6 text-center">
            <span className="text-primary-500">Acoustic</span> Duo
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-gray-300 space-y-4">
              <p className="text-lg">
                Mind's Eye View acoustic band consists of 2 members from our full band, 
                <strong className="text-white"> Sean Bradley</strong> and 
                <strong className="text-white"> Mike Markiewicz</strong>.
              </p>
              <p className="text-lg">
                We play classic acoustic hits that resonate with all ages. When our acoustic duo performs 
                at your event, you can be sure everyone will recognize and love the music.
              </p>
            </div>
            <div className="text-center">
              <a
                href="/acoustic"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Learn More About Our Acoustic Duo
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Book Us for Your Event
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Mind's Eye View is currently accepting bookings and would be thrilled to be the life of your next party.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}
