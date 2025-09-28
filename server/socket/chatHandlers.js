import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const chatHandlers = (socket, io) => {
  
  // Handle joining a chat room
  socket.on('join_chat', async (chatId) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit('error', 'Chat not found');
        return;
      }

      // Check if user is a participant
      const isParticipant = chat.participants.some(
        p => p.entity.toString() === socket.userId.toString()
      );

      if (!isParticipant) {
        socket.emit('error', 'Not authorized to join this chat');
        return;
      }

      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);

      // Mark messages as read when joining chat
      await Message.updateMany(
        {
          chat: chatId,
          'readBy.entity': { $ne: socket.userId },
          sender: { $ne: socket.userId }
        },
        {
          $push: {
            readBy: {
              entity: socket.userId,
              model: socket.userModel
            }
          }
        }
      );

      // Notify other participants that user is online
      socket.to(chatId).emit('user_joined', {
        userId: socket.userId,
        userName: socket.userName
      });

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle leaving a chat room
  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle sending a message
  socket.on('send_message', async (data) => {
    try {
      const { chatId, content, messageType = 'text' } = data;

      let chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit('error', 'Chat not found');
        return;
      }

      // Verify user is participant
      const isParticipant = chat.participants.some(
        p => p.entity.toString() === socket.userId.toString()
      );

      if (!isParticipant) {
        socket.emit('error', 'Not authorized to send messages in this chat');
        return;
      }

      // Create new message
      const message = new Message({
        chat: chatId,
        sender: socket.userId,
        senderModel: socket.userModel,
        content,
        messageType
      });

      await message.save();
      await message.populate('sender', 'name avatar');

      // Update chat's last message and activity
      chat.lastMessage = message._id;
      chat.lastActivity = new Date();
      chat.unreadCount += 1;
      await chat.save();

      // Emit to all participants in the chat
      io.to(chatId).emit('new_message', {
        message,
        chatId
      });

      // Create notifications for other participants
      const otherParticipants = chat.participants.filter(p => 
        p.entity.toString() !== socket.userId.toString()
      );

      for (const participant of otherParticipants) {
        const notification = new Notification({
          recipient: participant.entity,
          recipientModel: participant.model,
          sender: socket.userId,
          senderModel: socket.userModel,
          type: 'message',
          title: 'New Message',
          message: `You have a new message from ${socket.userName}`,
          relatedEntity: chat._id,
          relatedEntityModel: 'Chat'
        });
        await notification.save();

        // Send real-time notification
        io.to(participant.entity.toString()).emit('new_notification', notification);
      }

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { chatId } = data;
    socket.to(chatId).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      chatId
    });
  });

  socket.on('typing_stop', (data) => {
    const { chatId } = data;
    socket.to(chatId).emit('user_stop_typing', {
      userId: socket.userId,
      userName: socket.userName,
      chatId
    });
  });

  // Handle message read receipts
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId, chatId } = data;

      await Message.findByIdAndUpdate(messageId, {
        $addToSet: {
          readBy: {
            entity: socket.userId,
            model: socket.userModel
          }
        }
      });

      // Notify other participants that message was read
      socket.to(chatId).emit('message_read', {
        messageId,
        readerId: socket.userId,
        readerName: socket.userName
      });

    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle chat creation
  socket.on('create_chat', async (data) => {
    try {
      const { participantId, participantModel } = data;

      // Check if chat already exists
      let chat = await Chat.findOne({
        participants: {
          $all: [
            { entity: socket.userId, model: socket.userModel },
            { entity: participantId, model: participantModel }
          ]
        }
      });

      if (!chat) {
        // Create new chat
        chat = new Chat({
          participants: [
            { entity: socket.userId, model: socket.userModel },
            { entity: participantId, model: participantModel }
          ],
          lastActivity: new Date()
        });
        await chat.save();
      }

      await chat.populate('participants.entity', 'name avatar');

      socket.emit('chat_created', chat);
      socket.join(chat._id.toString());

    } catch (error) {
      socket.emit('error', error.message);
    }
  });
};