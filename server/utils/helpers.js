import jwt from 'jsonwebtoken'

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d', // default to 7 days if not set
  })
}

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.verify(token, process.env.JWT_SECRET)
}

/**
 * Generate 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Remove sensitive fields from user object
 */
export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user
  const { password, ...sanitizedUser } = userObj
  return sanitizedUser
}

/**
 * Paginate an array
 */
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}
  results.total = array.length
  results.page = page
  results.limit = limit
  results.totalPages = Math.ceil(array.length / limit)
  results.data = array.slice(startIndex, endIndex)

  return results
}

/**
 * Calculate match score between job requirements and candidate skills
 */
export const calculateMatchScore = (jobRequirements, candidateSkills) => {
  const requiredSkills = (jobRequirements.skills || []).map(s => s.toLowerCase())
  const candidateSkillSet = new Set((candidateSkills || []).map(s => s.toLowerCase()))

  if (requiredSkills.length === 0) return 100

  const matchedSkills = requiredSkills.filter(skill => candidateSkillSet.has(skill))
  return Math.round((matchedSkills.length / requiredSkills.length) * 100)
}
