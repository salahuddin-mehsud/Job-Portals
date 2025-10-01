// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth.js'
import { socketService } from '../services/socket.js'

// Create Context
const AuthContext = createContext()
export { AuthContext }

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log('[AuthContext] Checking auth status, token exists:', !!token)
    
    if (!token) {
      setLoading(false)
      setIsAuthenticated(false)
      return
    }

    // Set the token before making the request
    authService.setToken(token)

    // Try to get the current user
    const result = await authService.getCurrentUser()

    console.log('[AuthContext] getCurrentUser result:', result)

    if (!result.success || !result.data) {
      console.warn('Auth check: no valid user data returned', result)
      localStorage.removeItem('token')
      authService.clearToken()
      setIsAuthenticated(false)
      setUser(null)
      return
    }

    // The user data is in result.data
    const userData = result.data
    
    console.log('[AuthContext] User data retrieved:', userData)
    console.log('[AuthContext] User type:', result.userType)

    setUser(userData)
    setIsAuthenticated(true)

    // Connect socket only if token and user exist
    socketService.connect(token)
    try {
      socketService.emit('authenticate', userData._id || userData.id)
    } catch (e) {
      console.warn('Socket authenticate failed:', e)
    }
    
  } catch (error) {
    console.error('Auth check failed:', error)
    // Only remove token if it's an authentication error
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      authService.clearToken()
    }
    setUser(null)
    setIsAuthenticated(false)
  } finally {
    setLoading(false)
  }
}

 const login = async (email, password) => {
  try {
    const response = await authService.login(email, password)
    
    if (response?.success) {
      const userData = response.data?.user || response.data
      const token = response.data?.token || response.token

      if (token) {
        localStorage.setItem('token', token)
        authService.setToken(token) // Make sure to set the token
      }

      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
        socketService.connect(token)
        try {
          socketService.emit('authenticate', userData._id || userData.id)
        } catch (e) {
          console.warn('Socket authenticate failed:', e)
        }
      }
      return { success: true }
    }

    return { success: false, message: response?.message || 'Login failed' }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    }
  }
}

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      if (response.success) {
        return { success: true }
      }
      return { success: false, message: response?.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    socketService.disconnect()
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
