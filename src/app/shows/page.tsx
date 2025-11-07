import { Metadata } from 'next'
import { UpcomingShows } from '@/components/UpcomingShows'

export const metadata: Metadata = {
  title: 'Upcoming Shows',
  description: "Check out Mind's Eye View upcoming performances and book your tickets for high energy classic rock shows.",
}

export default function ShowsPage() {
  return (
    <div className="bg-rock-dark min-h-screen py-20">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-center mb-6">
          Upcoming <span className="text-primary-500">Shows</span>
        </h1>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
          Join us for an unforgettable night of classic rock! Check out our schedule below and 
          mark your calendars for our next performance.
        </p>
      </div>
      <UpcomingShows />
    </div>
  )
}
