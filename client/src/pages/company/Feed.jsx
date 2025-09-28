import React, { useState, useEffect } from 'react'
import { Plus, Users, Building, TrendingUp } from 'lucide-react'
import { postService } from '../../services/postService.js'
import PostCard from '../../components/common/PostCard.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const CompanyFeed = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatingPost, setCreatingPost] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await postService.getPosts()
      if (response.success) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    setCreatingPost(true)
    try {
      const response = await postService.createPost({ content: newPost })
      if (response.success) {
        setPosts([response.data, ...posts])
        setNewPost('')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setCreatingPost(false)
    }
  }

  const handlePostUpdate = () => {
    loadPosts() // Refresh posts after interactions
  }

  if (loading) {
    return <LoadingSpinner text="Loading your feed..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Updates</h1>
          <p className="text-gray-600 mt-2">Share updates and engage with your audience</p>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share company news, job openings, or industry insights..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newPost.trim() || creatingPost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {creatingPost ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="text-blue-600" size={24} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-lg font-semibold">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Building className="text-green-600" size={24} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-lg font-semibold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="text-purple-600" size={24} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Engagement</p>
              <p className="text-lg font-semibold">45%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start sharing updates to engage with your audience.
          </p>
        </div>
      )}
    </div>
  )
}

export default CompanyFeed