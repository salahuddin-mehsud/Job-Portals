import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import { calculateMatchScore } from '../utils/helpers.js';
import csv from 'csv-parser';
import fs from 'fs';

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

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name avatar industry location website bio')
      .populate('applications');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body || {};

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job'
      });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(job, req.user.skills);

    const application = new Application({
       job: jobId,
       candidate: req.user._id,
       resume: req.user.resume,
       coverLetter: coverLetter || "",   // 👈 allow empty
       matchScore
    });


    await application.save();

    // Add application to job
    job.applications.push(application._id);
    await job.save();

    // Create notification for company
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

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
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