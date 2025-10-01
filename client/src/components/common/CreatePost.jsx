// components/common/CreatePost.jsx
import React, { useState, useRef } from 'react'
import { Image, X, Send } from 'lucide-react'
import { postService } from '../../services/postService.js'
import toast from 'react-hot-toast'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (file) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Please log in to upload images')
      }

      const response = await postService.uploadImage(file)
      return response.data.url
    } catch (error) {
      console.error('Failed to upload images:', error)
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }
      throw new Error('Failed to upload image. Please try again.')
    }
  }

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB')
          continue
        }

        const imageUrl = await handleImageUpload(file)
        setImages(prev => [...prev, { url: imageUrl, file }])
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images to your post')
      return
    }

    setLoading(true)
    try {
      const postData = {
        content: content.trim(),
        media: images.map(img => img.url)
      }

      await postService.createPost(postData)
      setContent('')
      setImages([])
      toast.success('Post created successfully!')
      onPostCreated?.()
    } catch (error) {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, ask a question, or post an update..."
          className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
        />
        
        {/* Image preview */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              <Image size={20} />
              <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (!content.trim() && images.length === 0)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost