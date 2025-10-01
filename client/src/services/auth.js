// src/services/auth.js
import api, { setAuthToken } from './api.js'

export const authService = {
  async login(email, password) {
    return await api.post('/auth/login', { email, password })
  },

  async register(userData) {
    return await api.post('/auth/register', userData)
  },

async getCurrentUser() {
  console.log('[authService] Checking current user...')

  // Helper function to validate response
  const isValidResponse = (response) => {
    return response && response.success && response.data !== null && response.data !== undefined;
  }

  try {
    console.log('[authService] Trying /users/profile...')
    const userRes = await api.get('/users/profile')
    console.log('[authService] User profile response:', userRes)
    
    if (isValidResponse(userRes)) {
      return { 
        success: true, 
        data: userRes.data,
        userType: 'candidate'
      }
    }
    // If we get here, user profile was not valid - continue to company check
  } catch (err) {
    console.error('[authService] /users/profile failed:', err.message)
    // Continue to company check
  }

  try {
    console.log('[authService] Trying /companies/profile...')
    const companyRes = await api.get('/companies/profile')
    console.log('[authService] Company profile response:', companyRes)
    
    if (isValidResponse(companyRes)) {
      return { 
        success: true, 
        data: companyRes.data,
        userType: 'company'
      }
    }
  } catch (err2) {
    console.error('[authService] /companies/profile failed:', err2.message)
  }

  console.error('[authService] Both profile checks failed → returning null')
  return { success: false, data: null }
},

  async verifyEmail(token) {
    return await api.get(`/auth/verify-email?token=${token}`)
  },

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token, newPassword) {
    return await api.post('/auth/reset-password', { token, newPassword })
  },

  async updateProfile(profileData) {
    return await api.put('/users/profile', profileData)
  },

  async uploadAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  return await api.post('/users/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
},

  setToken(token) {
    console.log('[authService] Setting token:', token)
    setAuthToken(token)
  },

  clearToken() {
    console.log('[authService] Clearing token')
    setAuthToken(null)
  }
}
