'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('https://formspree.io/f/xjkjbbvj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Thanks for reaching out! We\'ll get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          eventType: '',
          message: '',
        })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Unable to send message. Please email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-rock-dark min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-center mb-6">
          Get in <span className="text-primary-500">Touch</span>
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Mind's Eye View is currently accepting bookings and would be thrilled to be the life of your next party.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold mb-4">Contact Information</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-1">Bookings</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email:</p>
                    <a href="mailto:bookings@mindseyeview.net" className="text-primary-400 hover:text-primary-300">
                      bookings@mindseyeview.net
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Sean Bradley:</p>
                    <a href="tel:610-470-4166" className="text-primary-400 hover:text-primary-300">
                      610-470-4166
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Social Media</h3>
                <div className="space-y-2">
                  <div>
                    <a
                      href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Follow us on Facebook
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://www.youtube.com/@MindsEyeView"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch us on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rock-light p-6 rounded-lg mt-8">
              <h3 className="font-semibold text-white mb-3">Perfect For:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Weddings</li>
                <li>• Corporate Events</li>
                <li>• Private Parties</li>
                <li>• Bars & Venues</li>
                <li>• Festivals</li>
              </ul>
            </div>
          </div>

          <div className="bg-rock-light p-8 rounded-lg">
            <h2 className="text-2xl font-display font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium mb-2">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select an option</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="private">Private Party</option>
                  <option value="bar">Bar/Venue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
