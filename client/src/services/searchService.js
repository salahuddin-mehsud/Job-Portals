import api from './api.js'

export const searchService = {
  async searchUsers(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value)
    })

    const queryString = params.toString()
    const url = queryString ? `/search?type=users&${queryString}` : `/search?type=users`
    console.log('SearchUsers URL:', url)
    return await api.get(url)
  },

  async searchCompanies(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value)
    })
    const queryString = params.toString()
    const url = queryString ? `/search?type=companies&${queryString}` : `/search?type=companies`
    console.log('SearchCompanies URL:', url)
    return await api.get(url)
  },

  async searchJobs(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.append(key, value)
    })
    const queryString = params.toString()
    const url = queryString ? `/search?type=jobs&${queryString}` : `/search?type=jobs`
    console.log('SearchJobs URL:', url)
    return await api.get(url)
  },

  async globalSearch(query, type = '') {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (type) params.append('type', type)
    const queryString = params.toString()
    const url = queryString ? `/search?${queryString}` : `/search`
    console.log('GlobalSearch URL:', url)
    return await api.get(url)
  }
}
