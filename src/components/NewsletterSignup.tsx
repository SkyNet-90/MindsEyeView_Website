'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Thanks for subscribing! We\'ll keep you updated on upcoming shows.')
        setEmail('')
        setName('')
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-rock-dark to-rock-darker">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Stay in the <span className="text-primary-500">Loop</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join our email list to get notified about upcoming shows and special events
        </p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-lg bg-rock-light border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-lg bg-rock-light border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  )
}
