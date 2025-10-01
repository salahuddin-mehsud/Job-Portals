// pages/Feeds.jsx
import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { postService } from '../services/postService.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import CreatePost from '../components/common/CreatePost.jsx'
import PostCard from '../components/common/PostCard.jsx'
import { useAuth } from '../hooks/useAuth.js'

const Feeds = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await postService.getFeedPosts()
      if (response.success) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdate = () => {
    loadPosts()
  }

  if (loading) {
    return <LoadingSpinner text="Loading your feed..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
        <p className="text-gray-600 mt-2">
          See posts from users, companies, and your network
        </p>
      </div>

      {/* Only show CreatePost if user is authenticated */}
      {user && <CreatePost onPostCreated={handlePostUpdate} />}

      {/* Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} showDelete={true} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user ? 'Create your first post or connect with others to see posts in your feed.' : 'Please log in to see posts in your feed.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Feeds