import api from './api.js'

export const userService = {
  async searchUsers(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value)
    })
    const qs = params.toString()
    const url = qs ? `/users/search?${qs}` : `/users/search`
    console.log('userService.searchUsers ->', url)
    return await api.get(url)
  },

  async getUserProfile(id) {
    return await api.get(`/users/${id}`)
  },

  async updateProfile(profileData) {
    return await api.put('/users/profile', profileData)
  },

  async sendConnectionRequest(recipientId, recipientType = 'User') {
    console.log('userService.sendConnectionRequest ->', { recipientId, recipientType })
    return await api.post('/users/connections/request', {
      recipientId,
      recipientType
    })
  },

  async followUser(userId) {
    return await api.post(`/users/follow/${userId}`)
  },

  async getConnections() {
    return await api.get('/users/connections')
  },

  // ✅ Add pending requests inside userService
  async getPendingConnectionRequests() {
    return await api.get('/users/connections/pending')
  },

  async respondConnectionRequest(connectionId, action) {
    return await api.post('/users/connections/respond', { connectionId, action })
  }
}
