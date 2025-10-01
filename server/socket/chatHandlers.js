// socket/chatHandlers.js
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const chatHandlers = (socket, io) => {
  
  // Handle joining a chat room
  socket.on('join_chat', async (chatId) => {
    try {
      // Check if socket is authenticated
      if (!socket.userId) {
        socket.emit('error', 'Not authenticated');
        return;
      }

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

    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', error.message);
    }
  });

  // Handle sending a message
  socket.on('send_message', async (data) => {
    try {
      // Check if socket is authenticated
      if (!socket.userId) {
        socket.emit('error', 'Not authenticated');
        return;
      }

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
      await chat.save();

      console.log(`Message sent in chat ${chatId} by user ${socket.userId}`);

      // Emit to all participants in the chat room (including sender for confirmation)
      io.to(chatId).emit('new_message', {
        message: message.toObject(),
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

        // Send real-time notification to the participant's personal room
        io.to(participant.entity.toString()).emit('new_notification', notification);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', error.message);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    if (!socket.userId) return;
    
    const { chatId } = data;
    socket.to(chatId).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName,
      chatId
    });
  });

  socket.on('typing_stop', (data) => {
    if (!socket.userId) return;
    
    const { chatId } = data;
    socket.to(chatId).emit('user_stop_typing', {
      userId: socket.userId,
      userName: socket.userName,
      chatId
    });
  });

  // Handle message read receipts
  socket.on('mark_messages_read', async (data) => {
    try {
      if (!socket.userId) return;

      const { chatId } = data;
      
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

      console.log(`Messages marked as read for user ${socket.userId} in chat ${chatId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Handle chat creation
  socket.on('create_chat', async (data) => {
    try {
      if (!socket.userId) {
        socket.emit('error', 'Not authenticated');
        return;
      }

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
      console.error('Error creating chat:', error);
      socket.emit('error', error.message);
    }
  });
};