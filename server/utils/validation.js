import { body } from 'express-validator';

// Simple validation for registration
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['candidate', 'company']),
];

// Simple validation for login
export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// User profile validation
export const userProfileValidation = [
  body('name').optional().trim(),
  body('bio').optional().trim(),
  body('skills').optional(),
];

// Simplified job validation
export const jobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('requirements').optional(),
  body('location').notEmpty().withMessage('Location is required'),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric(),
  body('employmentType').optional().isIn(['full-time', 'part-time', 'contract', 'internship']),
];
