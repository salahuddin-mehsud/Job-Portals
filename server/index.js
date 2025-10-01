import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import profileRoutes from './routes/profiles.js';
// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chats.js';
import postRoutes from './routes/posts.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';
import multer from 'multer';
// Socket imports
import { chatHandlers } from './socket/chatHandlers.js';
import { notificationHandlers } from './socket/notificationHandlers.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Vercel-specific configuration
const isVercel = process.env.VERCEL === '1';
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app-name.vercel.app' // Replace with your actual Vercel domain after deployment
];

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  // Important for Vercel compatibility
  transports: ['polling', 'websocket']
});

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer config - store file in memory (buffer), max size 5MB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profiles', profileRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Serve static files from React app in production
if (isVercel || process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
}

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  next(error);
});

// Simple test upload route
app.post('/api/test-upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file' });
    }

    const { cloudinary } = await import('./config/cloudinary.js');
    
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'proconnect-test'
    });

    res.json({ 
      success: true, 
      message: 'Upload test successful', 
      url: result.secure_url 
    });
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test upload failed: ' + error.message 
    });
  }
});

// Cloudinary debug route
app.get('/api/debug-cloudinary', (req, res) => {
  const cloudinary = require('cloudinary').v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not set',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'Not set',
    config: cloudinary.config()
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Store online users in memory (for simplicity)
const onlineUsers = new Set();

// Helper function to get online user IDs
function getOnlineUserIds() {
  return Array.from(onlineUsers);
}

// Socket.io connection handling with authentication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Extract token from handshake
  const token = socket.handshake.auth.token;
  
  if (!token) {
    console.log('No token provided for socket connection');
    socket.emit('error', 'No token provided');
    socket.disconnect();
    return;
  }

  try {
    // Verify token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if we have the required user info
    if (!decoded.userId) {
      console.log('Token missing userId');
      socket.emit('error', 'Invalid token: missing userId');
      socket.disconnect();
      return;
    }

    // Set socket user information from token
    socket.userId = decoded.userId;
    socket.userModel = decoded.role === 'company' ? 'Company' : 'User';
    socket.userName = decoded.name || 'User';
    
    console.log(`Socket authenticated for user: ${socket.userId} (${socket.userModel})`);

    // Add user to online users
    socket.join(socket.userId);
    onlineUsers.add(socket.userId);
    
    // Broadcast that this user is now online
    socket.broadcast.emit('user_online', socket.userId);

    // Send current online users to this socket
    socket.emit('online_users', getOnlineUserIds());

    // Set up handlers
    chatHandlers(socket, io);
    notificationHandlers(socket, io);

    console.log(`Online users: ${getOnlineUserIds().length}`);

  } catch (error) {
    console.error('Socket authentication failed:', error.message);
    socket.emit('error', 'Authentication failed: ' + error.message);
    socket.disconnect();
    return;
  }

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit('user_offline', socket.userId);
    }
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI}`);
  console.log(`⚡ Vercel: ${isVercel ? 'Yes' : 'No'}`);
});