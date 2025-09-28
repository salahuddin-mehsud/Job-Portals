import express from 'express';
import {
  getApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getApplications);
router.get('/:id', getApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', withdrawApplication);

export default router;