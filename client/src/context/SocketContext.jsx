import React, { createContext, useContext, useEffect, useState } from 'react'
import { socketService } from '../services/socket.js'
import { useAuth } from './AuthContext.jsx'

// ✅ Named export so you can import { SocketContext }
export const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [typingUsers, setTypingUsers] = useState({})
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Socket event listeners
    socketService.on('connect', () => {
      console.log('Connected to server')
    })

    socketService.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socketService.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    socketService.on('notification_marked_read', (notification) => {
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notification._id ? notification : notif
        )
      )
    })

    socketService.on('unread_count', (count) => {
      setUnreadCount(count)
    })

    socketService.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set(prev.add(userId)))
    })

    socketService.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    })

    socketService.on('user_typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.chatId]: [...(prev[data.chatId] || []).filter(id => id !== data.userId), data.userId]
      }))
    })

    socketService.on('user_stop_typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.chatId]: (prev[data.chatId] || []).filter(id => id !== data.userId)
      }))
    })

    return () => {
      socketService.off('connect')
      socketService.off('disconnect')
      socketService.off('new_notification')
      socketService.off('notification_marked_read')
      socketService.off('unread_count')
      socketService.off('user_online')
      socketService.off('user_offline')
      socketService.off('user_typing')
      socketService.off('user_stop_typing')
    }
  }, [isAuthenticated, user])

  const markNotificationAsRead = (notificationId) => {
    socketService.emit('mark_notification_read', notificationId)
  }

  const markAllNotificationsAsRead = () => {
    socketService.emit('mark_all_notifications_read')
  }

  const sendTypingIndicator = (chatId) => {
    if (user) {
      socketService.emit('typing_start', { chatId, userId: user._id, userName: user.name })
    }
  }

  const stopTypingIndicator = (chatId) => {
    if (user) {
      socketService.emit('typing_stop', { chatId, userId: user._id, userName: user.name })
    }
  }

  const value = {
    notifications,
    unreadCount,
    onlineUsers,
    typingUsers,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendTypingIndicator,
    stopTypingIndicator,
    isConnected: socketService.connected
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
