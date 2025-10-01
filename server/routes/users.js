// routes/users.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  getConnections,
  sendConnectionRequest,
  followUser,
  searchUsers,
  respondToConnectionRequest,
  getPendingConnectionRequests,
  saveJob,
  unsaveJob,
  getSavedJobs
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userProfileValidation } from '../utils/validation.js';
import { validate } from '../middleware/validation.js';
import { upload } from '../config/cloudinary.js'
import { uploadUserAvatar } from '../controllers/userController.js'

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(userProfileValidation), updateProfile);
router.get('/connections', getConnections);
router.post('/connections/request', sendConnectionRequest);
router.post('/connections/respond', respondToConnectionRequest);
router.post('/follow/:userId', followUser);
router.get('/search', searchUsers);
router.post('/profile/avatar', authenticate, upload.single('avatar'), uploadUserAvatar);

// Saved jobs routes
router.post('/save-job/:jobId', saveJob);
router.delete('/unsave-job/:jobId', unsaveJob);
router.get('/saved-jobs', getSavedJobs);

// ✅ New route for pending requests
router.get('/connections/pending', getPendingConnectionRequests);

export default router;