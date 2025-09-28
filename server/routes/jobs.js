import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  applyForJob,
  bulkUploadJobs
} from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { jobValidation } from '../utils/validation.js';
import { validate } from '../middleware/validation.js';
import { uploadBulkJobs } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJob);

router.use(authenticate);

router.post('/', validate(jobValidation), createJob);
router.post('/:jobId/apply', applyForJob);
router.post('/bulk-upload', uploadBulkJobs.single('file'), bulkUploadJobs);

export default router;