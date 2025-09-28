import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'requesterModel' },
  requesterModel: { type: String, required: true, enum: ['User', 'Company'] },
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'recipientModel' },
  recipientModel: { type: String, required: true, enum: ['User', 'Company'] },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date }
});

// Ensure unique connection request
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model('Connection', connectionSchema);