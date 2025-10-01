// middleware/upload.js
import multer from 'multer';

// Use memory storage for resume uploads (to get buffer for Cloudinary)
const resumeStorage = multer.memoryStorage();

// Configure storage for bulk job uploads (keep as is)
const bulkJobStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bulk-jobs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'jobs-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadResume = multer({
  storage: resumeStorage, // Changed to memoryStorage
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resumes'), false);
    }
  }
});

export const uploadBulkJobs = multer({
  storage: bulkJobStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'), false);
    }
  }
});