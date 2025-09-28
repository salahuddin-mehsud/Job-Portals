import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
  senderModel: { type: String, required: true, enum: ['User', 'Company'] },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'file', 'image'], default: 'text' },
  fileUrl: { type: String },
  isRead: { type: Boolean, default: false },
  readBy: [{
    entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'readBy.model' },
    model: { type: String, enum: ['User', 'Company'] },
    readAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);