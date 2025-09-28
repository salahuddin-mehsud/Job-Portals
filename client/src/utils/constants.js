export const API_URL = import.meta.env.VITE_API_URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' }
]

export const EXPERIENCE_LEVELS = [
  { value: 'internship', label: 'Internship' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' }
]

export const SALARY_RANGES = [
  { value: '0-30000', label: 'Up to $30,000' },
  { value: '30000-50000', label: '$30,000 - $50,000' },
  { value: '50000-80000', label: '$50,000 - $80,000' },
  { value: '80000-100000', label: '$80,000 - $100,000' },
  { value: '100000-150000', label: '$100,000 - $150,000' },
  { value: '150000+', label: '$150,000+' }
]

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Real Estate',
  'Transportation',
  'Energy',
  'Media',
  'Government',
  'Non-profit'
]

export const SKILLS = [
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Product Management',
  'Sales',
  'Marketing',
  'Finance',
  'HR',
  'Operations'
]

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  VIEWED: 'viewed',
  INTERVIEW: 'interview',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: 'Pending',
  [APPLICATION_STATUS.VIEWED]: 'Viewed',
  [APPLICATION_STATUS.INTERVIEW]: 'Interview',
  [APPLICATION_STATUS.HIRED]: 'Hired',
  [APPLICATION_STATUS.REJECTED]: 'Rejected'
}

export const APPLICATION_STATUS_COLORS = {
  [APPLICATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [APPLICATION_STATUS.VIEWED]: 'bg-blue-100 text-blue-800',
  [APPLICATION_STATUS.INTERVIEW]: 'bg-purple-100 text-purple-800',
  [APPLICATION_STATUS.HIRED]: 'bg-green-100 text-green-800',
  [APPLICATION_STATUS.REJECTED]: 'bg-red-100 text-red-800'
}

export const NOTIFICATION_TYPES = {
  APPLICATION: 'application',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  JOB: 'job'
}

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Singapore',
  'India',
  'Japan',
  'Brazil',
  'Mexico'
]

export const TIMEZONES = [
  'EST - Eastern Standard Time',
  'PST - Pacific Standard Time',
  'CST - Central Standard Time',
  'MST - Mountain Standard Time',
  'GMT - Greenwich Mean Time',
  'CET - Central European Time',
  'IST - Indian Standard Time',
  'JST - Japan Standard Time'
]