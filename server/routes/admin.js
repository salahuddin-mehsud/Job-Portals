import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getCompanies,
  getJobs,
  getPosts,
  banUser,
  unbanUser,
  deleteJob,
  deletePost,
  getAdminLogs
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/companies', getCompanies);
router.get('/jobs', getJobs);
router.get('/posts', getPosts);
router.get('/logs', getAdminLogs);
router.patch('/users/:userId/ban', banUser);
router.patch('/users/:userId/unban', unbanUser);
router.delete('/jobs/:jobId', deleteJob);
router.delete('/posts/:postId', deletePost);

export default router;