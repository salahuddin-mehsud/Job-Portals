import api from './api.js'

export const notificationService = {
  async getNotifications(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/notifications?${params}`)
  },

  async markAsRead(notificationId) {
    return await api.patch(`/notifications/${notificationId}/read`)
  },

  async markAllAsRead() {
    return await api.patch('/notifications/read-all')
  },

  async deleteNotification(notificationId) {
    return await api.delete(`/notifications/${notificationId}`)
  }
}