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
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
          Upcoming <span className="text-primary-500">Shows</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-rock-darker rounded-lg p-6 border border-gray-800 hover:border-primary-500 transition-colors"
            >
              <div className="mb-4">
                <div className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                  {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                </div>
                <div className="text-gray-400 text-sm">
                  {format(new Date(event.eventDate), 'h:mm a')}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <div className="text-gray-300 mb-2">
                <div className="font-semibold">{event.venue}</div>
                {event.address && (
                  <div className="text-sm text-gray-400">{event.address}</div>
                )}
              </div>
              {event.description && (
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
              )}
              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Get Tickets
                </a>
              )}
              {event.isAcoustic && (
                <span className="inline-block mt-2 bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold">
                  Acoustic Set
                </span>
              )}
            </div>
          ))}
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
