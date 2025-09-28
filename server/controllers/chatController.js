import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: {
        $elemMatch: {
          entity: req.user._id,
          model: req.user.role === 'candidate' ? 'User' : 'Company'
        }
      }
    })
      .populate('participants.entity', 'name avatar')
      .populate('lastMessage')
      .sort({ lastActivity: -1 });

    // Calculate unread counts for each chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          'readBy.entity': { $ne: req.user._id },
          sender: { $ne: req.user._id }
        });
        
        return {
          ...chat.toObject(),
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      data: chatsWithUnread
    });
  } catch (error) {
    next(error);
  }
};

export const getOrCreateChat = async (req, res, next) => {
  try {
    const { participantId, participantModel } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: {
        $all: [
          { entity: req.user._id, model: req.user.role === 'candidate' ? 'User' : 'Company' },
          { entity: participantId, model: participantModel }
        ]
      }
    })
      .populate('participants.entity', 'name avatar')
      .populate('lastMessage');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [
          { entity: req.user._id, model: req.user.role === 'candidate' ? 'User' : 'Company' },
          { entity: participantId, model: participantModel }
        ],
        lastActivity: new Date()
      });
      await chat.save();
      await chat.populate('participants.entity', 'name avatar');
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant
    const isParticipant = chat.participants.some(
      p => p.entity.toString() === req.user._id.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        chat: chatId,
        'readBy.entity': { $ne: req.user._id },
        sender: { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            entity: req.user._id,
            model: req.user.role === 'candidate' ? 'User' : 'Company'
          }
        }
      }
    );

    res.json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant
    const isParticipant = chat.participants.some(
      p => p.entity.toString() === req.user._id.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      senderModel: req.user.role === 'candidate' ? 'User' : 'Company',
      content,
      messageType
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update chat
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};