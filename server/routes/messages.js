import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get conversation between two users
router.get('/conversation/:otherUserId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.otherUserId },
        { sender: req.params.otherUserId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'fullName profilePicture')
    .populate('receiver', 'fullName profilePicture')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

// Get all conversations for a user
router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'fullName profilePicture')
    .populate('receiver', 'fullName profilePicture')
    .sort({ timestamp: -1 });

    // Group by conversation partner
    const conversations = {};
    for (const message of messages) {
      const partnerId = message.sender._id.toString() === req.user.id 
        ? message.receiver._id.toString() 
        : message.sender._id.toString();
      
      if (!conversations[partnerId] || 
          new Date(message.timestamp) > new Date(conversations[partnerId].timestamp)) {
        
        // Get unread count
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          receiver: req.user.id,
          isRead: false
        });
        
        conversations[partnerId] = {
          _id: partnerId,
          fullName: message.sender._id.toString() === req.user.id 
            ? message.receiver.fullName 
            : message.sender.fullName,
          profilePicture: message.sender._id.toString() === req.user.id 
            ? message.receiver.profilePicture 
            : message.sender.profilePicture,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unreadCount
        };
      }
    }

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error });
  }
});

// Mark messages as read
router.put('/markAsRead/:senderId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user.id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error });
  }
});

export default router;   