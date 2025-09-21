import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
  issuedBy: String,
  date: Date
});

// 🔹 Company profile schema
const companyProfileSchema = new mongoose.Schema({
  name: String,
  industry: String,
  size: String,
  website: String,
  description: String,
  headquarters: String,
  foundingYear: Number,
  employeeCount: Number,

  // Contact Info
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  contactPosition: String,

  // Billing
  billingPlan: String,
  paymentMethod: String,
  billingAddress: String,
  billingCity: String,
  billingState: String,
  billingZip: String,
  billingCountry: String,

  // Branding
  logoUrl: String,
  culturePhotos: [String],
  culturePhotosCaptions: [String],
  colors: {
    primary: String,
    secondary: String
  },
  
  // NEW: Followers for companies
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  professionalTitle: { type: String, default: '' },
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number
    }
  ],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  resumeUrl: String,
  profilePicture: String,
  certificates: [certificateSchema],
  applications: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    status: {
      type: String,
      enum: ['Applied', 'In Review', 'Interview', 'Rejected', 'Accepted'],
      default: 'Applied'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    notes: String,
    resume: String,
    coverLetter: String
  }],
  
  // Resume and profile information
  resume: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }
  ],
  education: [
    {
      school: String,
      degree: String,
      field: String,
      startYear: Number,
      endYear: Number,
      description: String
    }
  ],

  // 🔹 New field for user/company role
  role: {
    type: String,
    enum: ['user', 'company'], // only two valid values
    default: 'user' // normal job seeker by default
  },

  // 🔹 Company profile (only used when role = 'company')
  companyProfile: companyProfileSchema,
  
  // NEW: Follow system fields
  followingCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followingUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // NEW: Skills for users
  skills: [String],
  
  // NEW: Socket.IO fields
  socketId: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// NEW: Indexes for better search performance
userSchema.index({ 
  fullName: 'text', 
  'companyProfile.name': 'text',
  professionalTitle: 'text',
  skills: 'text'
});

userSchema.index({ role: 1 });
userSchema.index({ 'companyProfile.industry': 1 });

export default mongoose.model('User', userSchema);