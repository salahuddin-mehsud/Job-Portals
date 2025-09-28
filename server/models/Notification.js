import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'recipientModel' 
  },
  recipientModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Company'] 
  },

  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'senderModel' 
  },
  senderModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Company'] 
  },

  type: { 
    type: String, 
    required: true, 
    enum: [
      'application', 
      'connection', 
      'message', 
      'like', 
      'comment', 
      'follow', 
      'job'
    ] 
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  relatedEntity: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'relatedEntityModel',
    required: false 
  },
  relatedEntityModel: { 
  type: String, 
  enum: ['Job', 'Application', 'Post', 'User', 'Company', 'Chat', 'Connection'] 
},


  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { 
  timestamps: true 
});

// 🔹 Index for quick lookup (fetch unread notifications fast)
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
