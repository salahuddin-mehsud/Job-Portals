import { io } from 'socket.io-client'

// Use relative path in production, environment variable in development
const getSocketUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use the same domain (Vercel will handle routing)
    return window.location.origin
  } else {
    // In development, use the environment variable or localhost
    return import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
  }
}

const SOCKET_URL = getSocketUrl()

console.log('Socket URL:', SOCKET_URL)

class SocketService {
  constructor() {
    this.socket = null
    this.token = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.isProduction = import.meta.env.PROD
  }

  connect(token) {
    // If already connected with same token, return
    if (this.socket && this.socket.connected && this.token === token) {
      console.log('Socket already connected with same token')
      return
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.disconnect()
    }

    this.token = token
    this.reconnectAttempts = 0

    console.log('Connecting socket to:', SOCKET_URL)
    console.log('With token:', token ? 'Yes' : 'No')

    // Vercel-specific configuration
    const socketOptions = {
      auth: { 
        token: token 
      },
      // Use polling as primary transport for Vercel compatibility
      transports: this.isProduction ? ['polling', 'websocket'] : ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      // Additional options for Vercel
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true
    }

    this.socket = io(SOCKET_URL, socketOptions)

    this.socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', this.socket.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Socket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
        // Fallback to polling only if websocket fails
        if (this.socket) {
          this.socket.io.opts.transports = ['polling']
        }
      }
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Socket reconnection attempt ${attempt}`)
    })

    this.socket.on('reconnect', (attempt) => {
      console.log(`✅ Socket reconnected after ${attempt} attempts`)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this.token = null
      console.log('🔌 Socket disconnected and cleaned up')
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    } else {
      console.warn(`Cannot add listener for ${event}: socket not connected`)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
      return true
    } else {
      console.warn('Socket not connected, cannot emit:', event, data)
      return false
    }
  }

  // Safe emit with callback for important events
  emitWithAck(event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'))
        return
      }

      this.socket.emit(event, data, (response) => {
        if (response && response.success) {
          resolve(response)
        } else {
          reject(response || new Error('No response from server'))
        }
      })

      // Timeout fallback
      setTimeout(() => {
        reject(new Error('Socket emit timeout'))
      }, timeout)
    })
  }

  get connected() {
    return this.socket?.connected || false
  }

  get id() {
    return this.socket?.id || null
  }
}

export const socketService = new SocketService()