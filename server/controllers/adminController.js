import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Post from '../models/Post.js';
import Application from '../models/Application.js';
import AdminLog from '../models/AdminLog.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalPosts = await Post.countDocuments();

    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentStats = {
      users: await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      companies: await Company.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      jobs: await Job.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      applications: await Application.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    };

    // Job status distribution
    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Application status distribution
    const applicationStatusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          companies: totalCompanies,
          jobs: totalJobs,
          applications: totalApplications,
          posts: totalPosts
        },
        recent: recentStats,
        jobStatus: jobStatusStats,
        applicationStatus: applicationStatusStats
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const companies = await Company.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      data: {
        companies,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const jobs = await Job.find(filter)
      .populate('company', 'name avatar industry')
      .sort(sort)
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

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let filter = {};
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true, banReason: reason },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user._id,
      action: 'ban_user',
      target: userId,
      targetModel: 'User',
      details: `Banned user: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await adminLog.save();

    res.json({
      success: true,
      message: 'User banned successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: false, banReason: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user._id,
      action: 'unban_user',
      target: userId,
      targetModel: 'User',
      details: 'User unbanned',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await adminLog.save();

    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { reason } = req.body;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user._id,
      action: 'delete_job',
      target: jobId,
      targetModel: 'Job',
      details: `Job deleted: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await adminLog.save();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Also delete associated comments
    await Comment.deleteMany({ post: postId });

    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user._id,
      action: 'delete_post',
      target: postId,
      targetModel: 'Post',
      details: `Post deleted: ${reason}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await adminLog.save();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, startDate, endDate } = req.query;
    
    let filter = {};
    if (action) {
      filter.action = action;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await AdminLog.find(filter)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminLog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        logs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};