'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'

interface Video {
  id: number
  title: string
  description: string | null
  youtubeUrl: string
  youtubeId: string
  isAcoustic: boolean
  displayOrder: number
}

export default function EditVideoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    isAcoustic: false,
    displayOrder: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.id) {
      fetchVideo()
    }
  }, [session, params.id])

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/admin/videos/${params.id}`)
      const video = await response.json()
      setFormData({
        title: video.title,
        description: video.description || '',
        youtubeUrl: video.youtubeUrl,
        isAcoustic: video.isAcoustic,
        displayOrder: video.displayOrder,
      })
    } catch (error) {
      toast.error('Failed to load video')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/videos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Video updated successfully!')
        router.push('/admin/videos')
      } else {
        toast.error('Failed to update video')
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

  if (status === 'loading' || !session || fetchLoading) {
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
            Edit <span className="text-primary-500">Video</span>
          </h1>
          <Link href="/admin/videos" className="text-gray-400 hover:text-white">
            ← Back to Videos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-rock-light p-8 rounded-lg space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
            />
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
            />
          </div>

          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAcoustic"
                  checked={formData.isAcoustic}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-rock-darker border border-gray-700 rounded"
                />
                <span className="ml-2 text-sm font-medium">Mark as Acoustic</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/videos"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
