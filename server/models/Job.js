import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  location: { type: String, required: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], required: true },
  category: { type: String, required: true },
  keywords: [{ type: String }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  expiresAt: { type: Date, required: true },
  views: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' } // for versioning
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({ title: 'text', description: 'text', requirements: 'text', keywords: 'text' });
jobSchema.index({ company: 1, createdAt: -1 });

export default mongoose.model('Job', jobSchema);