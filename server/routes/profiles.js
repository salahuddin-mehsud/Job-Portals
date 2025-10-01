import express from 'express';
import {
  getUserProfile,
  getCompanyProfile,
  followUser,
  unfollowUser
} from '../controllers/profileController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (optional auth for following status)
router.get('/users/:userId', optionalAuth, getUserProfile);
router.get('/companies/:companyId', optionalAuth, getCompanyProfile);

// Protected routes for follow/unfollow
router.post('/users/:userId/follow', authenticate, followUser);
router.post('/users/:userId/unfollow', authenticate, unfollowUser);

export default router;