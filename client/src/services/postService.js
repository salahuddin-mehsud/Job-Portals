// services/postService.js
import api from './api.js'

export const postService = {
  async getPosts(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return await api.get(`/posts?${params}`)
  },

  async getFeedPosts(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    params.append('feed', 'true')
    return await api.get(`/posts?${params}`)
  },

  async getPost(id) {
    return await api.get(`/posts/${id}`)
  },

  async createPost(postData) {
    return await api.post('/posts', postData)
  },

  async uploadImage(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return await api.post('/posts/upload-image', formData)
  },

  async likePost(postId) {
    return await api.post(`/posts/${postId}/like`)
  },

  async commentOnPost(postId, commentData) {
    return await api.post(`/posts/${postId}/comment`, commentData)
  },

  async deletePost(postId) {
    return await api.delete(`/posts/${postId}`)
  }
}