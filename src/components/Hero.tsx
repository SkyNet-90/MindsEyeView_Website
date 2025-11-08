'use client'

import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-background.jpg"
          alt="Mind's Eye View performing live"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rock-darker/50 to-rock-darker"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Brighton Sign Image */}
          <div className="order-2 md:order-1">
            <div className="relative w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/brighton-sign.jpg"
                alt="Mind's Eye View Brighton Sign"
                width={2048}
                height={1536}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left order-1 md:order-2">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
              Mind's Eye <span className="text-primary-500">View</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              High Energy Classic Rock from the 60's through the 2000's
            </p>
            <p className="text-base md:text-lg mb-8 text-gray-300">
              Celebrating <span className="text-primary-400 font-bold">20 Years</span> of Live Music Excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/shows"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                See Upcoming Shows
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all border-2 border-white/30"
              >
                Book Us Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white/70"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}
