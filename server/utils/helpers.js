import jwt from 'jsonwebtoken'

/**
 * Generate JWT token
 */

/**
 * Generate 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateToken = (entity) => {
  return jwt.sign(
    {
      userId: entity._id.toString(),
      role: entity.role,
      name: entity.name,
      email: entity.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const sanitizeUser = (entity) => {
  if (!entity) return null;
  
  const sanitized = { ...entity.toObject ? entity.toObject() : entity };
  delete sanitized.password;
  delete sanitized.resetPasswordToken;
  delete sanitized.resetPasswordExpire;
  delete sanitized.verificationToken;
  
  return sanitized;
};

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
