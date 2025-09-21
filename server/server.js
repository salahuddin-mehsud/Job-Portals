import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import companyRoutes from "./routes/companyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import followRoutes from "./routes/follow.js";
import searchRoutes from "./routes/search.js";
import messageRoutes from "./routes/messages.js"; // NEW: Import message routes
import path from "path";
import { fileURLToPath } from "url";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();
const app = express();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/messages", messageRoutes); // NEW: Add message routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their room
  socket.on('join', async (userId) => {
    try {
      // Import User model
      const User = (await import('./models/User.js')).default;
      
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
      
      // Import models
      const Message = (await import('./models/Message.js')).default;
      const User = (await import('./models/User.js')).default;
      
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
      const Message = (await import('./models/Message.js')).default;
      const User = (await import('./models/User.js')).default;
      
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
    socket.to(receiverId).emit('typingStart', { senderId });
  });

  socket.on('typingStop', (data) => {
    const { senderId, receiverId } = data;
    socket.to(receiverId).emit('typingStop', { senderId });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    try {
      // Import User model
      const User = (await import('./models/User.js')).default;
      
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

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));