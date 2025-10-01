// pages/company/Feed.jsx
import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { postService } from '../../services/postService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import CreatePost from '../../components/common/CreatePost.jsx'
import PostCard from '../../components/common/PostCard.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import Avatar from '../../components/common/Avatar.jsx'

const CompanyFeed = () => {
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
        <h1 className="text-3xl font-bold text-gray-900">Professional Feed</h1>
        <p className="text-gray-600 mt-2">Stay updated with your network and industry news</p>
      </div>

       {user && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-start space-x-4">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="flex-1">
              {/* keep CreatePost as before but pass user if you want */}
              <CreatePost onPostCreated={handlePostUpdate} user={user} />
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} showDelete={true} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts in your feed</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user ? 'Connect with people and companies to see posts in your feed.' : 'Please log in to see posts in your feed.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default CompanyFeed