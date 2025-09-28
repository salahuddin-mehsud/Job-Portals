import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validations
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['candidate', 'company']),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// User validations
export const userProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('skills').optional().isArray(),
];

// Job validations
export const jobValidation = [
  body('title').trim().isLength({ min: 5 }),
  body('description').trim().isLength({ min: 10 }),
  body('requirements').isArray(),
  body('location').trim().isLength({ min: 2 }),
  body('salaryRange.min').isNumeric(),
  body('salaryRange.max').isNumeric(),
  body('employmentType').isIn(['full-time', 'part-time', 'contract', 'internship']),
];