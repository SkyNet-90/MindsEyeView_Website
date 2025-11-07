import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

interface UpcomingShowsProps {
  limit?: number
}

export async function UpcomingShows({ limit }: UpcomingShowsProps) {
  const events = await prisma.event.findMany({
    where: {
      eventDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      eventDate: 'asc',
    },
    take: limit || 10,
  })

  if (events.length === 0) {
    return (
      <section className="py-20 bg-rock-light">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            Upcoming <span className="text-primary-500">Shows</span>
          </h2>
          <div className="text-center text-gray-400">
            <p className="text-xl mb-4">No upcoming shows scheduled yet.</p>
            <p className="text-lg">Check back soon or contact us for booking!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-rock-light">
      <div className="container mx-auto px-4 max-w-4xl">
        {!limit && (
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
            Upcoming <span className="text-primary-500">Shows</span>
          </h2>
        )}
        <div className="space-y-6 mb-8">
          {events.map((event) => {
            const eventDate = new Date(event.eventDate)
            const endDate = event.endDate ? new Date(event.endDate) : null
            
            return (
              <div
                key={event.id}
                className="bg-rock-darker rounded-lg overflow-hidden border border-gray-800 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
              >
                <div className="md:flex">
                  {/* Date Section */}
                  <div className="md:w-48 bg-gradient-to-br from-primary-600 to-primary-700 p-6 flex flex-col items-center justify-center text-center">
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
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-gray-300">
                        <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">
                          {format(eventDate, 'h:mm a')}
                          {endDate && ` - ${format(endDate, 'h:mm a')}`}
                        </span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Get Tickets
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {limit && (
          <div className="text-center">
            <Link
              href="/shows"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Shows
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
