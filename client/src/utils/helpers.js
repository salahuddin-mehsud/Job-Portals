import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm')
  } else if (isYesterday(dateObj)) {
    return 'Yesterday'
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE')
  } else if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d')
  } else {
    return format(dateObj, 'MMM d, yyyy')
  }
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  }
  return number.toString()
}

export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const sanitizeHtml = (html) => {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}

export const generateAvatar = (name, size = 40) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-teal-500'
  ]
  
  const color = colors[name?.length % colors.length] || 'bg-gray-500'
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  
  return { color, initials }
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const calculateMatchScore = (jobRequirements, candidateSkills) => {
  if (!jobRequirements || !candidateSkills) return 0
  
  const requiredSkills = jobRequirements.map(skill => skill.toLowerCase())
  const candidateSkillSet = new Set(candidateSkills.map(skill => skill.toLowerCase()))
  
  if (requiredSkills.length === 0) return 100
  
  const matchedSkills = requiredSkills.filter(skill => candidateSkillSet.has(skill))
  return Math.round((matchedSkills.length / requiredSkills.length) * 100)
}

export const sortJobsByRelevance = (jobs, userSkills) => {
  return jobs.map(job => ({
    ...job,
    matchScore: calculateMatchScore(job.requirements, userSkills)
  })).sort((a, b) => b.matchScore - a.matchScore)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const isTokenExpired = (token) => {
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true
  
  return Date.now() >= decoded.exp * 1000
}