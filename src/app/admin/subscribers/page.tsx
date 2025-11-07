'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Subscriber {
  id: number
  email: string
  subscribedAt: string
}

export default function AdminSubscribersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSubscribers()
    }
  }, [session])

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers')
      const data = await response.json()
      setSubscribers(data)
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return

    try {
      const response = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchSubscribers()
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
    }
  }

  const exportEmails = () => {
    const emails = subscribers.map(sub => sub.email).join('\n')
    const blob = new Blob([emails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
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
            Newsletter <span className="text-primary-500">Subscribers</span>
          </h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-400">
            Total Subscribers: <span className="text-white font-bold">{subscribers.length}</span>
          </div>
          {subscribers.length > 0 && (
            <button
              onClick={exportEmails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Export Email List
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="bg-rock-light p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No subscribers yet.</p>
          </div>
        ) : (
          <div className="bg-rock-light rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-rock-darker border-b border-gray-800">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 font-semibold">Subscribed On</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-gray-800 hover:bg-rock-darker/50">
                    <td className="px-6 py-4">{subscriber.email}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {format(new Date(subscriber.subscribedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
