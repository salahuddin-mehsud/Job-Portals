import api from './api.js'

export const adminService = {
  async getDashboardStats() {
    return await api.get('/admin/dashboard')
  },

  async getUsers(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/admin/users?${params}`)
  },

  async getCompanies(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/admin/companies?${params}`)
  },

  async getJobs(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/admin/jobs?${params}`)
  },

  async banUser(userId) {
    return await api.patch(`/admin/users/${userId}/ban`)
  },

  async deleteJob(jobId) {
    return await api.delete(`/admin/jobs/${jobId}`)
  }
}