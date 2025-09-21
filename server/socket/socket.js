import socketIO from "socket.io"
import Message from '../models/Message'
import User from "../models/User";

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIO(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join user to their room
      socket.on('join', async (userId) => {
        try {
          // Store socket ID in user document
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
          socket.join(userId);
          console.log(`User ${userId} joined room with socket ID: ${socket.id}`);
        } catch (error) {
          console.error('Error joining room:', error);
        }
      });

      // Handle sending messages
      socket.on('sendMessage', async (data) => {
        try {
          const { senderId, receiverId, content } = data;
          
          // Save message to database
          const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content
          });
          
          await message.save();
          
          // Populate sender info
          await message.populate('sender', 'fullName profilePicture');
          
          // Emit to receiver if online
          const receiver = await User.findById(receiverId);
          if (receiver && receiver.socketId) {
            io.to(receiver.socketId).emit('receiveMessage', message);
          }
          
          // Also send back to sender for confirmation
          socket.emit('messageSent', message);
          
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('messageError', { error: 'Failed to send message' });
        }
      });

      // Handle message read status
      socket.on('markAsRead', async (data) => {
        try {
          const { messageId, userId } = data;
          await Message.findByIdAndUpdate(messageId, { isRead: true });
          
          // Notify sender that their message was read
          const message = await Message.findById(messageId).populate('sender');
          if (message && message.sender.socketId) {
            io.to(message.sender.socketId).emit('messageRead', { messageId, readerId: userId });
          }
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });

      // Handle typing indicators
      socket.on('typingStart', (data) => {
        const { senderId, receiverId } = data;
        const receiver = io.sockets.sockets.get(receiverId);
        if (receiver) {
          receiver.emit('typingStart', { senderId });
        }
      });

      socket.on('typingStop', (data) => {
        const { senderId, receiverId } = data;
        const receiver = io.sockets.sockets.get(receiverId);
        if (receiver) {
          receiver.emit('typingStop', { senderId });
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        try {
          // Remove socket ID from user document
          await User.findOneAndUpdate({ socketId: socket.id }, { 
            socketId: null,
            lastSeen: new Date()
          });
          console.log('User disconnected:', socket.id);
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};