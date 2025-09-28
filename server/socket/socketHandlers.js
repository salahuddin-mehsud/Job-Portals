import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their own room for private messages
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, senderId, content, messageType = 'text' } = data;

        let chat = await Chat.findById(chatId);
        if (!chat) {
          // Create new chat if it doesn't exist
          chat = new Chat({
            participants: data.participants,
            lastActivity: new Date()
          });
          await chat.save();
        }

        const message = new Message({
          chat: chat._id,
          sender: senderId,
          content,
          messageType
        });

        await message.save();

        // Update chat's last message and activity
        chat.lastMessage = message._id;
        chat.lastActivity = new Date();
        chat.unreadCount += 1;
        await chat.save();

        // Populate message with sender details
        await message.populate('sender', 'name avatar');

        // Emit to all participants in the chat
        io.to(chatId).emit('newMessage', message);

        // Create notification for other participants
        const otherParticipants = chat.participants.filter(p => 
          p.entity.toString() !== senderId.toString()
        );

        for (const participant of otherParticipants) {
          const notification = new Notification({
            recipient: participant.entity,
            recipientModel: participant.model,
            sender: senderId,
            senderModel: data.senderModel,
            type: 'message',
            title: 'New Message',
            message: `You have a new message from ${data.senderName}`,
            relatedEntity: chat._id,
            relatedEntityModel: 'Chat'
          });
          await notification.save();

          // Send real-time notification
          io.to(participant.entity.toString()).emit('newNotification', notification);
        }

      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('typing', data);
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.chatId).emit('stopTyping', data);
    });

    // Handle message read receipts
    socket.on('markAsRead', async (data) => {
      try {
        const { messageId, readerId, readerModel } = data;
        
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: {
            readBy: {
              entity: readerId,
              model: readerModel
            }
          }
        });

        socket.to(data.chatId).emit('messageRead', {
          messageId,
          readerId,
          readerModel
        });
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};