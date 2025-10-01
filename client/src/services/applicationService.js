// src/services/applicationService.js
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

  // <-- Replace this function
  async submitApplication(jobId, payload) {
    // payload can be a FormData (file upload) or a plain object (JSON)
    if (payload instanceof FormData) {
      // axios will set appropriate multipart/form-data boundary
      return await api.post(`/jobs/${jobId}/apply`, payload)
    } else {
      // plain JSON
      return await api.post(`/jobs/${jobId}/apply`, payload)
    }
  },

  async updateApplicationStatus(applicationId, statusData) {
    return await api.patch(`/applications/${applicationId}/status`, statusData)
  },

  async withdrawApplication(applicationId) {
    return await api.delete(`/applications/${applicationId}`)
  }
}

export default applicationService
