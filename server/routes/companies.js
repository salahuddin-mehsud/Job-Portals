import express from 'express';
import {
  getProfile,
  updateProfile,
  getCompanyJobs,
  getCompanyAnalytics,
  searchCandidates,
  getAllCompanies
} from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();
router.get('/public', getAllCompanies)

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/jobs', getCompanyJobs);
router.get('/analytics', getCompanyAnalytics);
router.get('/search/candidates', searchCandidates);

export default router;