// src/services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// helper to set / clear Authorization header synchronously
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Request interceptor: ensure token present on each request (fallback)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: return response.data for convenience,
// but DO NOT auto-remove token or redirect on 401 — let Auth context handle that.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // don't mutate localStorage here; propagate error to caller
    return Promise.reject(error)
  }
)

export default api
