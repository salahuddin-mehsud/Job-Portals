import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
export const getProfile = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user._id)
      .populate('jobPostings')
      .populate('connections', 'name avatar bio')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar')
      .populate('followingCompanies', 'name avatar industry')
      .populate('notifications');

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'bio', 'avatar', 'industry', 'location', 'website', 'size', 'founded', 'socialMedia'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const company = await Company.findByIdAndUpdate(
      req.user._id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { company: req.user._id };
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.find(filter)
      .populate('applications')
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

export const getCompanyAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user._id;

    // Jobs
    const totalJobs = await Job.countDocuments({ company: companyId });
    const activeJobs = await Job.countDocuments({ company: companyId, status: 'active' });
    const companyJobs = await Job.find({ company: companyId }).select('_id views createdAt');
    const jobIds = companyJobs.map(job => job._id);

    // Applications
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const applicationStatusStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Job views
    const totalViews = companyJobs.reduce((sum, job) => sum + (job.views || 0), 0);

    // Performance Metrics
    const applications = await Application.find({ job: { $in: jobIds } })
      .select('status responseTime createdAt');

    const responseTimes = applications.filter(a => a.responseTime).map(a => a.responseTime);
    const avgResponseTime = responseTimes.length
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : 0;

    const interviewCount = applications.filter(a => a.status === 'interview').length;
    const hiredCount = applications.filter(a => a.status === 'hired').length;

    const interviewRate = totalApplications
      ? ((interviewCount / totalApplications) * 100).toFixed(1)
      : 0;

    const hireRate = totalApplications
      ? ((hiredCount / totalApplications) * 100).toFixed(1)
      : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentApplications = applications.filter(a => a.createdAt >= sevenDaysAgo).length;
    const recentJobs = companyJobs.filter(j => j.createdAt >= sevenDaysAgo).length;

    const recentActivity = [
      {
        type: 'applications',
        count: recentApplications,
        time: 'last 7 days'
      },
      {
        type: 'jobs',
        count: recentJobs,
        time: 'last 7 days'
      },
      {
        type: 'views',
        count: totalViews,
        time: 'last 7 days'
      }
    ];

    // Response
    res.json({
      success: true,
      data: {
        totals: {
          jobs: totalJobs,
          activeJobs,
          applications: totalApplications,
          totalViews
        },
        applicationStatus: applicationStatusStats,
        metrics: {
          avgResponseTime,
          interviewRate,
          hireRate
        },
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};


export const searchCandidates = async (req, res, next) => {
  try {
    const { query, skills, location, experience, page = 1, limit = 10 } = req.query;

    let filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim().toLowerCase());
      filter.skills = { $in: skillsArray };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      filter['experience.duration'] = { $gte: parseInt(experience) };
    }

    const candidates = await User.find(filter)
      .select('name avatar bio skills location education experience')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        candidates,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry, size, location } = req.query
    let filter = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ]
    }

    if (industry) filter.industry = industry
    if (size) filter.size = size
    if (location) filter.location = { $regex: location, $options: 'i' }

    const companies = await Company.find(filter).select(
      'name industry location size website bio avatar'
    )

    res.json({ success: true, data: { companies } })
  } catch (error) {
    next(error)
  }
}

export const followCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid company id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const companyToFollow = await Company.findById(companyId);
    if (!companyToFollow) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const followerId = req.user._id;
    const followerModel = req.user.role === 'company' ? 'Company' : 'User';

    // Use $addToSet to avoid duplicates and return updated doc
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { followers: followerId } },
      { new: true }
    ).select('followers');

    // Also add to follower's followingCompanies (or followingCompanies for a company)
    if (req.user.role === 'company') {
      await Company.findByIdAndUpdate(followerId, { $addToSet: { followingCompanies: companyId } });
    } else {
      await User.findByIdAndUpdate(followerId, { $addToSet: { followingCompanies: companyId } });
    }

    // Create a notification
    try {
      const notification = new Notification({
        recipient: companyId,
        recipientModel: 'Company',
        sender: followerId,
        senderModel: followerModel,
        type: 'follow',
        title: 'New Follower',
        message: `${req.user.name || req.user.companyName || 'Someone'} started following you`,
        relatedEntity: followerId,
        relatedEntityModel: followerModel
      });
      await notification.save();
    } catch (notifErr) {
      // Notification failure should not block follow action
      console.error('Failed to create follow notification:', notifErr);
    }

    return res.json({
      success: true,
      message: 'Followed company successfully',
      data: { followersCount: updatedCompany.followers.length }
    });
  } catch (error) {
    console.error('followCompany error:', error);
    next(error);
  }
};

/**
 * Unfollow company
 * POST /api/companies/:companyId/unfollow
 */
export const unfollowCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid company id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const followerId = req.user._id;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $pull: { followers: followerId } },
      { new: true }
    ).select('followers');

    if (req.user.role === 'company') {
      await Company.findByIdAndUpdate(followerId, { $pull: { followingCompanies: companyId } });
    } else {
      await User.findByIdAndUpdate(followerId, { $pull: { followingCompanies: companyId } });
    }

    return res.json({
      success: true,
      message: 'Unfollowed company successfully',
      data: { followersCount: updatedCompany ? updatedCompany.followers.length : 0 }
    });
  } catch (error) {
    console.error('unfollowCompany error:', error);
    next(error);
  }
};

/**
 * Get followers of a company (public)
 * GET /api/companies/:companyId/followers
 */
export const getCompanyFollowers = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid company id' });
    }

    const company = await Company.findById(companyId).populate('followers', 'name avatar role');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    return res.json({ success: true, data: company.followers });
  } catch (error) {
    console.error('getCompanyFollowers error:', error);
    next(error);
  }
};

/**
 * Get following (for current authenticated company/user)
 * GET /api/companies/following
 */
export const getCompanyFollowing = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const company = await Company.findById(req.user._id)
      .populate('following', 'name avatar bio')
      .populate('followingCompanies', 'name avatar industry');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    return res.json({
      success: true,
      data: {
        followingUsers: company.following || [],
        followingCompanies: company.followingCompanies || []
      }
    });
  } catch (error) {
    console.error('getCompanyFollowing error:', error);
    next(error);
  }
};
