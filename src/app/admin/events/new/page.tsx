'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function NewEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    address: '',
    eventDate: '',
    eventTime: '',
    ticketUrl: '',
    isAcoustic: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const handleDateTimeChange = (date: Date | null) => {
    setSelectedDateTime(date)
    if (date) {
      const dateStr = date.toISOString().split('T')[0]
      const timeStr = date.toTimeString().slice(0, 5)
      setFormData({
        ...formData,
        eventDate: dateStr,
        eventTime: timeStr,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const eventDateTime = `${formData.eventDate}T${formData.eventTime}:00`
      
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventDate: eventDateTime,
        }),
      })

      if (response.ok) {
        toast.success('Event created successfully!')
        setFormData({
          title: '',
          description: '',
          venue: '',
          address: '',
          eventDate: '',
          eventTime: '',
          ticketUrl: '',
          isAcoustic: false,
        })
        setSelectedDateTime(null)
        router.push('/admin/events')
      } else {
        toast.error('Failed to create event')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-rock-dark flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rock-dark">
      <div className="bg-rock-darker border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold">
            Add New <span className="text-primary-500">Event</span>
          </h1>
          <Link href="/admin/events" className="text-gray-400 hover:text-white">
            ← Back to Events
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-rock-light p-8 rounded-lg space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="e.g., Live at Joe's Bar"
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium mb-2">
              Venue *
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="e.g., The Rock Pub"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="123 Main St, City, State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date & Time * (Use calendar picker or type manually below)
            </label>
            <DatePicker
              selected={selectedDateTime}
              onChange={handleDateTimeChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholderText="Click to select date and time"
              calendarClassName="dark-calendar"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                Date * (or type manually)
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="eventTime" className="block text-sm font-medium mb-2">
                Time * <span className="text-gray-400 text-xs">(Eastern Time - Use your preferred format)</span>
              </label>
              <input
                type="time"
                id="eventTime"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Browser will display in your local time format</p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="Additional details about the event..."
            />
          </div>

          <div>
            <label htmlFor="ticketUrl" className="block text-sm font-medium mb-2">
              Ticket URL
            </label>
            <input
              type="url"
              id="ticketUrl"
              name="ticketUrl"
              value={formData.ticketUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAcoustic"
              name="isAcoustic"
              checked={formData.isAcoustic}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 bg-rock-darker border-gray-700 rounded focus:ring-primary-500"
            />
            <label htmlFor="isAcoustic" className="ml-2 text-sm">
              This is an acoustic set
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <Link
              href="/admin/events"
              className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-rock-darker transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
