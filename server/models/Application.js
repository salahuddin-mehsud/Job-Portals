import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String }, // URL to resume file
  coverLetter: { type: String },
  status: { type: String, enum: ['pending', 'viewed', 'interview', 'hired', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  viewedAt: { type: Date },
  interviewAt: { type: Date },
  hiredAt: { type: Date },
  rejectedAt: { type: Date },
  notes: { type: String }, // Company's notes about the candidate
  matchScore: { type: Number } // Calculated match score based on job requirements and candidate profile
}, {
  timestamps: true
});

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);