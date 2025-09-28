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
      if (!token) {
        setLoading(false)
        setIsAuthenticated(false)
        return
      }

      // Try to get the current user (function will try both /users/profile and /companies/profile)
      const resp = await authService.getCurrentUser()

      // The api wrapper returns response.data (your controllers return { success, data })
      // So resp is usually { success: true, data: userObject }
      const userObj = resp?.data ?? resp

      if (!userObj) {
        console.warn('Auth check: no user data returned', resp)
        // invalid token or unexpected response
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      // If userObj still contains success/data (double wrapped), handle that too:
      const finalUser = userObj?.data ?? userObj

      setUser(finalUser)
      setIsAuthenticated(true)

      // Connect socket only if token and user exist
      socketService.connect(token)
      // optional: emit authenticate event with id if your server expects it
      try {
        socketService.emit('authenticate', finalUser._id || finalUser.id)
      } catch (e) {
        // ignore if socket emit not handled or not needed
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // remove token if server responded with 401/400 (invalid/expired)
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      // api wrapper returns response.data (expected { success:true, data: { user, token } })
      if (response?.success) {
        const userData = response.data?.user ?? response.data
        const token = response.data?.token ?? response.token

        if (token) {
          localStorage.setItem('token', token)
        }

        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
          socketService.connect(token)
          try {
            socketService.emit('authenticate', userData._id || userData.id)
          } catch (e) {}
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
