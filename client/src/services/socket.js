import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

class SocketService {
  constructor() {
    this.socket = null
    this.token = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
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

    console.log('Connecting socket with token:', token ? 'Yes' : 'No')

    this.socket = io(SOCKET_URL, {
      auth: { 
        token: token 
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', this.socket.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.token = null
    }
  }

  on(event, callback) {
    this.socket?.on(event, callback)
  }

  off(event, callback) {
    this.socket?.off(event, callback)
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit:', event, data)
    }
  }

  get connected() {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()