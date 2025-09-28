// src/services/companyService.js
import api from './api.js'

// ✅ Helper: build query string safely
function buildQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, value)
    }
  })
  return qs.toString()
}

export async function getCompanyProfile() {
  return await api.get('/companies/profile')
}

export async function updateProfile(profileData) {
  return await api.put('/companies/profile', profileData)
}

export async function getCompanyAnalytics(params = {}) {
  const qs = buildQuery(params)
  const url = qs ? `/companies/analytics?${qs}` : '/companies/analytics'
  return await api.get(url)
}

export async function searchCandidates(filters = {}) {
  const qs = buildQuery(filters)
  const url = qs ? `/companies/search/candidates?${qs}` : '/companies/search/candidates'
  return await api.get(url)
}

export async function getCompanyJobs(params = {}) {
  const qs = buildQuery(params)
  const url = qs ? `/companies/jobs?${qs}` : '/companies/jobs'
  return await api.get(url)
}

export async function getCompaniesPublic(filters = {}) {
  const qs = buildQuery(filters)
  const url = qs ? `/companies/public?${qs}` : '/companies/public'
  return await api.get(url)
}



export const companyService = {
  getCompanyProfile,
  updateProfile,
  getCompanyAnalytics,
  searchCandidates,
  getCompanyJobs,
  getCompaniesPublic,
}
