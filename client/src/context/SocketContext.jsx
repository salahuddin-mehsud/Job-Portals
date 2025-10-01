import React, { createContext, useContext, useEffect, useState } from 'react'
import { socketService } from '../services/socket.js'
import { useAuth } from './AuthContext.jsx'

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
  const [isConnected, setIsConnected] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('Not authenticated, disconnecting socket')
      socketService.disconnect()
      setIsConnected(false)
      setOnlineUsers(new Set())
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found for socket connection')
      return
    }

    console.log('🔄 Setting up socket connection for user:', user._id)

    // Connect socket with token
    const socket = socketService.connect(token)

    // Socket event listeners
    const handleConnect = () => {
      console.log('✅ Socket connected successfully')
      setIsConnected(true)
      
      // Join user room after connection
      if (user._id) {
        socketService.emit('join', user._id)
      }
    }

    const handleDisconnect = (reason) => {
      console.log('🔴 Socket disconnected:', reason)
      setIsConnected(false)
    }

    const handleConnectError = (error) => {
      console.error('❌ Socket connection error:', error)
      setIsConnected(false)
    }

    const handleNewNotification = (notification) => {
      console.log('📢 New notification received:', notification)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    }

    const handleNotificationRead = (notificationId) => {
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const handleUnreadCount = (count) => {
      setUnreadCount(count)
    }

    const handleUserOnline = (userId) => {
      console.log('🟢 User came online:', userId)
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.add(userId)
        return newSet
      })
    }

    const handleUserOffline = (userId) => {
      console.log('🔴 User went offline:', userId)
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }

    const handleOnlineUsers = (userIds) => {
      console.log('👥 Received online users list:', userIds)
      setOnlineUsers(new Set(userIds))
    }

    const handleUserTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.chatId]: [...(prev[data.chatId] || []).filter(id => id !== data.userId), data.userId]
      }))
    }

    const handleUserStopTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.chatId]: (prev[data.chatId] || []).filter(id => id !== data.userId)
      }))
    }

    // Add event listeners
    socketService.on('connect', handleConnect)
    socketService.on('disconnect', handleDisconnect)
    socketService.on('connect_error', handleConnectError)
    socketService.on('new_notification', handleNewNotification)
    socketService.on('notification_marked_read', handleNotificationRead)
    socketService.on('unread_count', handleUnreadCount)
    socketService.on('user_online', handleUserOnline)
    socketService.on('user_offline', handleUserOffline)
    socketService.on('online_users', handleOnlineUsers)
    socketService.on('user_typing', handleUserTyping)
    socketService.on('user_stop_typing', handleUserStopTyping)

    return () => {
      console.log('🧹 Cleaning up socket listeners')
      // Clean up event listeners
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('connect_error', handleConnectError)
      socketService.off('new_notification', handleNewNotification)
      socketService.off('notification_marked_read', handleNotificationRead)
      socketService.off('unread_count', handleUnreadCount)
      socketService.off('user_online', handleUserOnline)
      socketService.off('user_offline', handleUserOffline)
      socketService.off('online_users', handleOnlineUsers)
      socketService.off('user_typing', handleUserTyping)
      socketService.off('user_stop_typing', handleUserStopTyping)
      
      // Don't disconnect socket here to maintain connection across route changes
      // Only disconnect when logging out (handled in AuthContext)
    }
  }, [isAuthenticated, user])

  const markNotificationAsRead = (notificationId) => {
    if (socketService.emit('mark_notification_read', notificationId)) {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllNotificationsAsRead = () => {
    if (socketService.emit('mark_all_notifications_read')) {
      // Optimistic update
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
      setUnreadCount(0)
    }
  }

  const sendTypingIndicator = (chatId) => {
    if (user && isConnected) {
      socketService.emit('typing_start', { 
        chatId, 
        userId: user._id, 
        userName: user.name 
      })
    }
  }

  const stopTypingIndicator = (chatId) => {
    if (user && isConnected) {
      socketService.emit('typing_stop', { 
        chatId, 
        userId: user._id, 
        userName: user.name 
      })
    }
  }

  const reconnect = () => {
    const token = localStorage.getItem('token')
    if (token) {
      socketService.connect(token)
    }
  }

  const value = {
    notifications,
    unreadCount,
    onlineUsers,
    typingUsers,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendTypingIndicator,
    stopTypingIndicator,
    reconnect,
    socket: socketService
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}