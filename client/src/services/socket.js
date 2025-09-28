import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    this.socket?.on(event, callback)
  }

  off(event, callback) {
    this.socket?.off(event, callback)
  }

  emit(event, data) {
    this.socket?.emit(event, data)
  }

  // ✅ Always check socket.io’s own connection status
  get connected() {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()
