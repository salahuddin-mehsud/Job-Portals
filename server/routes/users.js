import express from 'express';
import {
  getProfile,
  updateProfile,
  getConnections,
  sendConnectionRequest,
  followUser,
  searchUsers,
  respondToConnectionRequest,
  getPendingConnectionRequests // <-- import the pending requests controller
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userProfileValidation } from '../utils/validation.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(userProfileValidation), updateProfile);
router.get('/connections', getConnections);
router.post('/connections/request', sendConnectionRequest);
router.post('/connections/respond', respondToConnectionRequest);
router.post('/follow/:userId', followUser);
router.get('/search', searchUsers);

// ✅ New route for pending requests
router.get('/connections/pending', getPendingConnectionRequests);

export default router;
