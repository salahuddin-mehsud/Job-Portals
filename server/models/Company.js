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

  // job postings & core relations
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Connections: keep existing shape for compatibility (users)
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Followers & Following split by type (explicit arrays)
  // Users who follow this company
  followersUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Companies who follow this company (B2B follows)
  followersCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],

  // Who this company is following (users)
  followingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Who this company is following (other companies)
  followingCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],

  // Legacy fields (kept for backward compatibility if other code still references them)
  // We won't programmatically rely on these in new controllers — use the explicit arrays above.
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // legacy
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // legacy

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

// Text index for name, bio, industry
companySchema.index({ name: 'text', bio: 'text', industry: 'text' });


companySchema.add({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

export default mongoose.model('Company', companySchema);
