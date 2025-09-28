import api from './api.js'

export const applicationService = {
  async getApplications(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/applications?${params}`)
  },

  async getApplication(id) {
    return await api.get(`/applications/${id}`)
  },

  async updateApplicationStatus(id, data) {
    return await api.patch(`/applications/${id}/status`, data)
  },

  async withdrawApplication(id) {
    return await api.delete(`/applications/${id}`)
  }
}