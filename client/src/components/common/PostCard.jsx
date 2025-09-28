import React, { useState } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../hooks/useAuth.js'
import { postService } from '../../services/postService.js'
import toast from 'react-hot-toast'

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like.entity === user?._id))
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }

    try {
      const response = await postService.likePost(post._id)
      if (response.success) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
        onUpdate?.()
      }
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const response = await postService.commentOnPost(post._id, {
        content: commentText
      })

      if (response.success) {
        setCommentText('')
        toast.success('Comment added')
        onUpdate?.()
      }
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{post.author?.name}</h4>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Post Content */}
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Post Media */}
        {post.media && post.media.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {post.media.map((media, index) => (
              <img
                key={index}
                src={media}
                alt={`Post media ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{likeCount} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>

        {/* Post Actions */}
        <div className="flex border-t border-b border-gray-200 py-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
              isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            <span className="ml-2">Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
            <span className="ml-2">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:text-green-600 rounded-lg transition-colors">
            <Share size={18} />
            <span className="ml-2">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4">
            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="font-medium text-sm">{comment.author?.name}</p>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex space-x-3 text-xs text-gray-500 mt-1">
                      <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                      <button className="hover:text-gray-700">Like</button>
                      <button className="hover:text-gray-700">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard