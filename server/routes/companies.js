import express from 'express';
import {
  getProfile,
  updateProfile,
  getCompanyJobs,
  getCompanyAnalytics,
  searchCandidates,
  getAllCompanies,
  followCompany,
  unfollowCompany,
  getCompanyFollowers,
  getCompanyFollowing
} from '../controllers/companyController.js';

import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();
router.get('/public', getAllCompanies)

router.use(authenticate) // ensure authenticate middleware is used for protected routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/jobs', getCompanyJobs);
router.get('/analytics', getCompanyAnalytics);
router.get('/search/candidates', searchCandidates);

router.post('/:companyId/follow', followCompany);
router.post('/:companyId/unfollow', unfollowCompany);
router.get('/:companyId/followers', getCompanyFollowers);
router.get('/following', getCompanyFollowing);




export default router;