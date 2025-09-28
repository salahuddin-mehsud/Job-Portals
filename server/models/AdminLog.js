import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel' },
  targetModel: { type: String, enum: ['User', 'Company', 'Job', 'Post'] },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

export default mongoose.model('AdminLog', adminLogSchema);