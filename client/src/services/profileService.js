import api from './api.js'

export const profileService = {
  async getUserProfile(userId) {
    return await api.get(`/profiles/users/${userId}`)
  },

  async getCompanyProfile(companyId) {
    return await api.get(`/profiles/companies/${companyId}`)
  },

  async followUser(userId) {
    return await api.post(`/profiles/users/${userId}/follow`)
  },

  async unfollowUser(userId) {
    return await api.post(`/profiles/users/${userId}/unfollow`)
  }
}