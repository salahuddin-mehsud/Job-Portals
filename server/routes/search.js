import express from 'express';
import {
  globalSearch,
  advancedJobSearch
} from '../controllers/searchController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, globalSearch);
router.get('/jobs', advancedJobSearch);

export default router;