import express from 'express';
import {
  getChats,
  getOrCreateChat,
  getMessages,
  sendMessage
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getChats);
router.post('/create', getOrCreateChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

export default router;