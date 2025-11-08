'use client'

import { useState } from 'react'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

interface Event {
  id: number
  title: string
  venue: string
  address: string | null
  eventDate: Date
  endDate: Date | null
  isAcoustic: boolean
}

interface PastShowsProps {
  pastEvents: Event[]
}

export function PastShows({ pastEvents }: PastShowsProps) {
  const [showPast, setShowPast] = useState(false)

  if (pastEvents.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-rock-light">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <button
            onClick={() => setShowPast(!showPast)}
            className="inline-flex items-center bg-rock-darker hover:bg-rock-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-700"
          >
            {showPast ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide Previous Shows
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                View Previous Shows
              </>
            )}
          </button>
        </div>

        {showPast && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              Previous <span className="text-primary-500">Performances</span>
            </h2>
            {pastEvents.map((event) => {
              const eventDate = new Date(event.eventDate)
              const endDate = event.endDate ? new Date(event.endDate) : null

              return (
                <div
                  key={event.id}
                  className="bg-rock-darker rounded-lg overflow-hidden border border-gray-800 opacity-80"
                >
                  <div className="md:flex">
                    {/* Date Section */}
                    <div className="md:w-48 bg-gradient-to-br from-gray-600 to-gray-700 p-6 flex flex-col items-center justify-center text-center">
                      <div className="text-white/80 text-sm uppercase tracking-wider mb-1">
                        {format(eventDate, 'MMMM')}
                      </div>
                      <div className="text-5xl font-bold text-white leading-none mb-1">
                        {format(eventDate, 'dd')}
                      </div>
                      <div className="text-white/80 text-lg">
                        {format(eventDate, 'yyyy')}
                      </div>
                      {event.isAcoustic && (
                        <div className="mt-3 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                          Acoustic
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-6">
                      <h3 className="text-2xl font-bold mb-3 text-white">
                        {event.title}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-start text-gray-300">
                          <svg className="w-5 h-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div className="font-semibold">{event.venue}</div>
                            {event.address && (
                              <div className="text-sm text-gray-400">{event.address}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">
                            {format(eventDate, 'h:mm a')}
                            {endDate && ` - ${format(endDate, 'h:mm a')}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
