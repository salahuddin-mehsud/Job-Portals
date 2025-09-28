import api from './api.js'

export const jobService = {
  async getJobs(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/jobs?${params}`)
  },

  async getJob(id) {
    return await api.get(`/jobs/${id}`)
  },

  async createJob(jobData) {
    return await api.post('/jobs', jobData)
  },

  async applyForJob(jobId, applicationData) {
    return await api.post(`/jobs/${jobId}/apply`, applicationData)
  },

  async getCompanyJobs(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/companies/jobs?${params}`)
  },

  async bulkUploadJobs(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post('/jobs/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}