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

  try {
    console.log('[authService] Trying /users/profile...')
    const userRes = await api.get('/users/profile')
    console.log('[authService] Success: user profile', userRes.data)
    return userRes.data   // ✅ trust backend
  } catch (err) {
    console.error('[authService] /users/profile failed:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    })

    try {
      console.log('[authService] Trying /companies/profile...')
      const companyRes = await api.get('/companies/profile')
      console.log('[authService] Success: company profile', companyRes.data)
      return companyRes.data   // ✅ trust backend
    } catch (err2) {
      console.error('[authService] /companies/profile failed:', {
        status: err2.response?.status,
        data: err2.response?.data,
        message: err2.message,
      })

      console.error('[authService] Both profile checks failed → returning null')
      return null
    }
  }
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

  setToken(token) {
    console.log('[authService] Setting token:', token)
    setAuthToken(token)
  },

  clearToken() {
    console.log('[authService] Clearing token')
    setAuthToken(null)
  }
}
