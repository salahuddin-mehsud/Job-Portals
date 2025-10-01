import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { calculateMatchScore } from '../utils/helpers.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'; // ADD THIS IMPORT
import csv from 'csv-parser';
import fs from 'fs';
import { uploadResumeToCloudinary } from '../utils/resumeUpload.js';


export const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      company: req.user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    const job = new Job(jobData);
    await job.save();

    // Add job to company's job postings
    if (req.user.role === 'company') {
      await req.user.updateOne({
        $push: { jobPostings: job._id }
      });
    }

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, location, employmentType, category } = req.query;

    let filter = { status: 'active', expiresAt: { $gt: new Date() } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (employmentType) {
      filter.employmentType = employmentType;
    }

    if (category) {
      filter.category = category;
    }

    const jobs = await Job.find(filter)
      .populate('company', 'name avatar industry location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// In jobController.js, update getJob function:
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name avatar industry location website bio')
      .populate({
        path: 'applications',
        populate: {
          path: 'candidate',
          select: 'name avatar'
        }
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has applied
    let hasApplied = false;
    if (req.user && req.user.role === 'candidate') {
      const application = await Application.findOne({ 
        job: req.params.id, 
        candidate: req.user._id 
      });
      hasApplied = !!application;
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        hasApplied
      }
    });
  } catch (error) {
    next(error);
  }
};



// server/controllers/jobController.js
// ...keep existing imports at top (Job, Application, Notification, User, calculateMatchScore, uploadResumeToCloudinary, etc.)

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body || {};

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied for this job' });
    }

    // Determine resumeUrl (string) — priority: uploaded file -> body.resume -> user's profile resume
    let resumeUrl = null;

    // 1) If a file was uploaded via multer, upload to Cloudinary and use secure_url
    if (req.file && req.file.buffer) {
      try {
        console.log('Uploading resume to Cloudinary (server)...');
        const result = await uploadResumeToCloudinary(req.file.buffer, req.file.originalname);
        // prefer secure_url
        resumeUrl = result?.secure_url || result?.url || null;

        // update user profile resume string (optional but useful)
        if (resumeUrl) {
          await User.findByIdAndUpdate(req.user._id, { resume: resumeUrl }, { new: true });
        }

        console.log('Cloudinary upload result (resumeUrl):', resumeUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload resume to Cloudinary' });
      }
    }

    // 2) If no file, but client included resume in body (string or object), extract string
    if (!resumeUrl && req.body && req.body.resume) {
      const incoming = req.body.resume;
      if (typeof incoming === 'string') {
        resumeUrl = incoming;
      } else if (typeof incoming === 'object' && incoming !== null) {
        resumeUrl = incoming.url || incoming.secure_url || incoming.download_url || incoming.downloadUrl || null;
      }
      // persist profile string if found
      if (resumeUrl) {
        try {
          await User.findByIdAndUpdate(req.user._id, { resume: resumeUrl }, { new: true });
        } catch (err) {
          console.warn('Failed to update user resume field:', err.message);
        }
      }
    }

    // 3) fallback to req.user.resume if still nothing
    if (!resumeUrl && req.user && req.user.resume) {
      if (typeof req.user.resume === 'string') {
        resumeUrl = req.user.resume;
      } else if (typeof req.user.resume === 'object' && req.user.resume !== null) {
        resumeUrl = req.user.resume.url || req.user.resume.secure_url || req.user.resume.download_url || null;
      }
    }

    // Calculate match score
    const matchScore = calculateMatchScore(job, req.user?.skills || []);

    // Create application — store resume as a string (or null)
    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      resume: resumeUrl || null,
      coverLetter: coverLetter || "",
      matchScore
    });

    await application.save();

    // Push to job
    job.applications.push(application._id);
    await job.save();

    // Notification for company
    const notification = new Notification({
      recipient: job.company,
      recipientModel: 'Company',
      sender: req.user._id,
      senderModel: 'User',
      type: 'application',
      title: 'New Job Application',
      message: `${req.user.name} applied for your job: ${job.title}`,
      relatedEntity: application._id,
      relatedEntityModel: 'Application'
    });
    await notification.save();

    // Return application and the resume URL
    return res.status(201).json({
      success: true,
      data: {
        application,
        resumeUrl: resumeUrl || null
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    next(error);
  }
};





export const bulkUploadJobs = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const jobs = [];
    const errors = [];

    if (req.file.mimetype === 'application/json') {
      const jsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
      
      for (const jobData of jsonData) {
        try {
          const job = new Job({
            ...jobData,
            company: req.user._id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          await job.save();
          jobs.push(job);
        } catch (error) {
          errors.push({ job: jobData, error: error.message });
        }
      }
    } else {
      // CSV processing
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            jobs.push({
              ...row,
              company: req.user._id,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      for (const jobData of jobs) {
        try {
          const job = new Job(jobData);
          await job.save();
        } catch (error) {
          errors.push({ job: jobData, error: error.message });
        }
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: {
        successful: jobs.length - errors.length,
        errors,
        jobs
      }
    });
  } catch (error) {
    next(error);
  }
};