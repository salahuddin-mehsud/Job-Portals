// src/components/common/ChatWidget.jsx
import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const ChatWidget = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleOpenMessages = () => {
    if (!isAuthenticated) {
      // redirect to login or show login modal depending on your app
      navigate('/login')
      return
    }
    navigate('/messages')
  }

  return (
    <button
      onClick={handleOpenMessages}
      title="Messages"
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
    >
      <MessageCircle className="text-white" size={24} />
    </button>
  )
}

export default ChatWidget
