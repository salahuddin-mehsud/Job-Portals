// src/services/companyService.js
import api from './api.js'

// Profile / company endpoints
export async function getCompanyProfile() {
  return await api.get('/companies/profile')
}

export async function updateProfile(profileData) {
  return await api.put('/companies/profile', profileData)
}

export async function getCompanyAnalytics(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = qs ? `/companies/analytics?${qs}` : '/companies/analytics'
  return await api.get(url)
}

// Candidate search (company-only)
export async function searchCandidates(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.append(key, value)
  })
  const qs = params.toString()
  const url = qs ? `/companies/search/candidates?${qs}` : '/companies/search/candidates'
  return await api.get(url)
}

export async function getCompanyJobs(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const url = qs ? `/companies/jobs?${qs}` : '/companies/jobs'
  return await api.get(url)
}
export async function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  return await api.post('/companies/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// Public companies listing
export async function getCompaniesPublic(filters = {}) {
  const params = new URLSearchParams(filters).toString()
  const url = params ? `/companies/public?${params}` : '/companies/public'
  return await api.get(url)
}

// Follow / unfollow
export async function followCompany(companyId) {
  return await api.post(`/companies/${companyId}/follow`)
}

export async function unfollowCompany(companyId) {
  return await api.post(`/companies/${companyId}/unfollow`)
}

// Followers / following helpers expected by analytics page:
export async function getCompanyFollowers(companyId) {
  // public endpoint: returns { success: true, data: [...] }
  return await api.get(`/companies/${companyId}/followers`)
}

export async function getCompanyFollowing() {
  // protected endpoint: returns { success: true, data: { followingUsers, followingCompanies } }
  return await api.get('/companies/following')
}

// Export a convenience object for existing imports
export const companyService = {
  getCompanyProfile,
  updateProfile,
  getCompanyAnalytics,
  searchCandidates,
  getCompanyJobs,
  getCompaniesPublic,
  followCompany,
  unfollowCompany,
  getCompanyFollowers,
  getCompanyFollowing,
  uploadAvatar
}
