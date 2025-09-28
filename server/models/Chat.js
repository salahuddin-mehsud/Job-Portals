import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    entity: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'participants.model' },
    model: { type: String, required: true, enum: ['User', 'Company'] }
  }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCount: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Ensure that we have unique chat between two participants
chatSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model('Chat', chatSchema);