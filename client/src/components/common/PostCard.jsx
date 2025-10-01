// src/components/common/PostCard.jsx
import React, { useState } from 'react'
import { Heart, MessageCircle, Share, Trash2 } from 'lucide-react'
import { postService } from '../../services/postService.js'
import { useAuth } from '../../hooks/useAuth.js'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'

const PostCard = ({ post, onUpdate, showDelete = false }) => {
  const { user } = useAuth()
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)

  // robust like detection (like.entity may be id or object)
  const isLiked = !!(post.likes?.some((like) => {
    const entityId = (like.entity && (like.entity._id || like.entity)).toString?.() || String(like.entity)
    return user && entityId === user._id?.toString()
  }))

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }

    setIsLiking(true)
    try {
      await postService.likePost(post._id)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to like post:', error)
      toast.error('Failed to like post')
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsCommenting(true)
    try {
      await postService.commentOnPost(post._id, { content: newComment })
      setNewComment('')
      onUpdate?.()
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    try {
      await postService.deletePost(post._id)
      onUpdate?.()
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.max(1, Math.floor(diffInHours * 60))}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // defensive guards
  const author = post.author || {}
  const authorId = (author._id || author.id || '').toString()
  const authorRole = author.role === 'company' ? 'company' : 'candidate'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link
            to={authorRole === 'company' ? `/company/profile/${authorId}` : `/user/profile/${authorId}`}
            className="flex items-center space-x-3 hover:opacity-90"
          >
            <Avatar src={author.avatar} name={author.name} size="md" />
            <div>
              <h3 className="font-semibold text-gray-900">{author.name || 'Unknown'}</h3>
              <p className="text-sm text-gray-500">
                {authorRole === 'company' ? 'Company' : 'Professional'} • {formatTime(post.createdAt)}
              </p>
            </div>
          </Link>
        </div>

        {showDelete && user && (authorId === user._id?.toString()) && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-2 ${post.media.length === 1 ? 'grid-cols-1' : post.media.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {post.media.map((mediaUrl, index) => (
              <img
                key={index}
                src={typeof mediaUrl === 'string' ? mediaUrl : mediaUrl.url || ''}
                alt={`Post media ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>{post.likes?.length || 0} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-gray-200 pt-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          <span className="ml-2">Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center py-2 text-gray-600 rounded-lg hover:bg-gray-50"
        >
          <MessageCircle size={18} />
          <span className="ml-2">Comment</span>
        </button>

        <button className="flex-1 flex items-center justify-center py-2 text-gray-600 rounded-lg hover:bg-gray-50">
          <Share size={18} />
          <span className="ml-2">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isCommenting}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isCommenting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isCommenting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment) => {
              const cAuthor = comment.author || {}
              return (
                <div key={comment._id} className="flex space-x-3">
                  <Avatar src={cAuthor.avatar} name={cAuthor.name} size="sm" />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{cAuthor.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-900">{comment.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
