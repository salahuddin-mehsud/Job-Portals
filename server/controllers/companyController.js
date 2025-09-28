import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';

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

    // Basic counts
    const totalJobs = await Job.countDocuments({ company: companyId });
    const activeJobs = await Job.countDocuments({ company: companyId, status: 'active' });
    
    // Application stats
    const companyJobs = await Job.find({ company: companyId }).select('_id');
    const jobIds = companyJobs.map(job => job._id);
    
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    
    const applicationStatusStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent activity
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await Application.countDocuments({
      job: { $in: jobIds },
      appliedAt: { $gte: thirtyDaysAgo }
    });

    // Job views
    const totalViews = await Job.aggregate([
      { $match: { company: companyId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          jobs: totalJobs,
          activeJobs,
          applications: totalApplications,
          recentApplications,
          totalViews: totalViews[0]?.totalViews || 0
        },
        applicationStatus: applicationStatusStats
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
