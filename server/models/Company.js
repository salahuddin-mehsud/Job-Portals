import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'company' },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 500 },
  industry: { type: String },
  location: { type: String },
  website: { type: String },
  size: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
  founded: { type: Number },
  socialMedia: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followingCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
}, {
  timestamps: true
});

// Hash password before saving
companySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for search functionality
companySchema.index({ name: 'text', bio: 'text', industry: 'text' });

export default mongoose.model('Company', companySchema);