import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, jobId, sortBy = 'appliedAt', sortOrder = 'desc' } = req.query;
    
    let filter = {};
    
    if (req.user.role === 'candidate') {
      filter.candidate = req.user._id;
    } else if (req.user.role === 'company') {
      // Get jobs posted by this company
      const companyJobs = await Job.find({ company: req.user._id }).select('_id');
      filter.job = { $in: companyJobs.map(job => job._id) };
    }

    if (status) {
      filter.status = status;
    }

    if (jobId) {
      filter.job = jobId;
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const applications = await Application.find(filter)
      .populate('job', 'title company location employmentType salaryRange')
      .populate('candidate', 'name avatar skills education experience')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name avatar email bio skills education experience portfolioLinks');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check permissions
    if (req.user.role === 'candidate' && application.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'company') {
      const job = await Job.findById(application.job._id);
      if (job.company.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, interviewDate } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the company that posted the job
    const job = await Job.findById(application.job._id);
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    application.status = status;
    if (notes) application.notes = notes;
    if (interviewDate) application.interviewAt = new Date(interviewDate);

    // Set timestamps based on status change
    const now = new Date();
    if (status === 'viewed' && !application.viewedAt) {
      application.viewedAt = now;
    } else if (status === 'interview') {
      application.interviewAt = interviewDate ? new Date(interviewDate) : now;
    } else if (status === 'hired') {
      application.hiredAt = now;
    } else if (status === 'rejected') {
      application.rejectedAt = now;
    }

    await application.save();

    // Create notification for candidate
    const notification = new Notification({
      recipient: application.candidate._id,
      recipientModel: 'User',
      sender: req.user._id,
      senderModel: 'Company',
      type: 'application',
      title: 'Application Status Updated',
      message: `Your application for "${application.job.title}" has been updated to ${status}`,
      relatedEntity: application._id,
      relatedEntityModel: 'Application'
    });
    await notification.save();

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the candidate who applied
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (application.status === 'hired' || application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application in current status'
      });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};