'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Image from 'next/image'

interface Photo {
  id: number
  title: string | null
  filename: string
  filePath: string
  createdAt: string
}

export default function AdminPhotosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPhotos()
    }
  }, [session])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/admin/photos')
      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''))

        const response = await fetch('/api/admin/photos', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      toast.success('Photos uploaded successfully!')
      fetchPhotos()
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const deletePhoto = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Photo deleted')
        fetchPhotos()
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
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
            Manage <span className="text-primary-500">Photos</span>
          </h1>
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <label className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer inline-block">
            {uploading ? 'Uploading...' : '+ Upload Photos'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-gray-400 text-sm mt-2">
            You can select multiple photos at once
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="bg-rock-light p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No photos yet. Upload your first photos!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-rock-light rounded-lg overflow-hidden border border-gray-800">
                <div className="aspect-square relative">
                  <Image
                    src={photo.filePath}
                    alt={photo.title || 'Photo'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold truncate mb-2">
                    {photo.title || photo.filename}
                  </p>
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="text-red-500 hover:text-red-400 text-xs w-full text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
