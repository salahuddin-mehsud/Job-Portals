import api from './api.js'

export const chatService = {
  async getChats() {
    return await api.get('/chats')
  },

  async getOrCreateChat(participantId, participantModel) {
    return await api.post('/chats/create', { participantId, participantModel })
  },

  async getMessages(chatId, filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/chats/${chatId}/messages?${params}`)
  },

  async sendMessage(chatId, messageData) {
    return await api.post(`/chats/${chatId}/messages`, messageData)
  }
}