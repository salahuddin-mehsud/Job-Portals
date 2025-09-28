import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  likePost,
  commentOnPost,
  deletePost
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);

router.use(authenticate);

router.post('/', createPost);
router.post('/:id/like', likePost);
router.post('/:id/comment', commentOnPost);
router.delete('/:id', deletePost);

export default router;