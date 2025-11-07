'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Image from 'next/image'

interface Video {
  id: number
  title: string
  youtubeId: string
  isAcoustic: boolean
  displayOrder: number
}

export default function AdminVideosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    isAcoustic: false,
    displayOrder: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchVideos()
    }
  }, [session])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos')
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Video added successfully!')
        setFormData({
          title: '',
          youtubeUrl: '',
          description: '',
          isAcoustic: false,
          displayOrder: 0,
        })
        setShowAddForm(false)
        fetchVideos()
      } else {
        toast.error('Failed to add video')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const deleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Video deleted')
        fetchVideos()
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    }
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
            Manage <span className="text-primary-500">Videos</span>
          </h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {showAddForm ? 'Cancel' : '+ Add New Video'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-rock-light p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Add YouTube Video</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">YouTube URL *</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-rock-darker border border-gray-700 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAcoustic}
                    onChange={(e) => setFormData({ ...formData, isAcoustic: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-rock-darker border-gray-700 rounded"
                  />
                  <label className="ml-2 text-sm">Acoustic version</label>
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Add Video
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="bg-rock-light p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No videos yet. Add your first video!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-rock-light rounded-lg overflow-hidden border border-gray-800">
                <div className="aspect-video relative">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{video.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Order: {video.displayOrder}
                      {video.isAcoustic && (
                        <span className="ml-2 bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded-full text-xs">
                          Acoustic
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
