// routes/jobs.js
import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  applyForJob,
  bulkUploadJobs
} from '../controllers/jobController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { uploadBulkJobs } from '../middleware/upload.js';
import { uploadResume } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', optionalAuth, getJob); // Changed to optionalAuth for hasApplied check

// Protected routes
router.use(authenticate);

// Create job
router.post('/', (req, res, next) => {
  console.log('Incoming job payload:', req.body);
  next();
}, createJob);

// Apply for job with resume upload
router.post('/:jobId/apply', uploadResume.single('resume'), applyForJob);

// Bulk upload
router.post('/bulk-upload', uploadBulkJobs.single('file'), bulkUploadJobs);

export default router;