import { useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService.js'
import { useSocket } from './useSocket.js'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifications: realTimeNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useSocket()

  useEffect(() => {
    loadNotifications()
  }, [])

  // Sync with real-time notifications
  useEffect(() => {
    if (realTimeNotifications.length > 0) {
      setNotifications(realTimeNotifications)
    }
  }, [realTimeNotifications])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationService.getNotifications()
      if (response.success) {
        setNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      markNotificationAsRead(notificationId)
      await notificationService.markAsRead(notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      markAllNotificationsAsRead()
      await notificationService.markAllAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  }
}