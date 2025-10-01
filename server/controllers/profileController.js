import User from '../models/User.js';
import Company from '../models/Company.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';


export const getCompanyProfile = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID'
      });
    }

    const company = await Company.findById(companyId)
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken')
      .populate('followersUsers', 'name avatar role')
      .populate('followersCompanies', 'name avatar industry')
      .populate('followingUsers', 'name avatar role')
      .populate('followingCompanies', 'name avatar industry');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get company's posts
    const posts = await Post.find({ author: companyId, isPublic: true })
      .populate('author', 'name avatar role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar role'
        }
      })
      .sort({ createdAt: -1 })
      .limit(20);

    // Check if current user is following this company
    let isFollowing = false;
    if (req.user) {
      if (req.user.role === 'candidate') {
        const currentUser = await User.findById(req.user._id);
        isFollowing = currentUser.followingCompanies.includes(companyId);
      } else {
        const currentCompany = await Company.findById(req.user._id);
        isFollowing = currentCompany.followingCompanies.includes(companyId);
      }
    }

    // Combine all followers
    const allFollowers = [
      ...(company.followersUsers || []),
      ...(company.followersCompanies || [])
    ];

    res.json({
      success: true,
      data: {
        profile: company,
        posts,
        isFollowing,
        followersCount: allFollowers.length,
        followingCount: (company.followingUsers?.length || 0) + (company.followingCompanies?.length || 0)
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpire -verificationToken')
      .populate('followers', 'name avatar role')
      .populate('following', 'name avatar role')
      .populate('followingCompanies', 'name avatar industry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's posts
    const posts = await Post.find({ author: userId, isPublic: true })
      .populate('author', 'name avatar role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar role'
        }
      })
      .sort({ createdAt: -1 })
      .limit(20);

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      if (req.user.role === 'candidate') {
        const currentUser = await User.findById(req.user._id);
        isFollowing = currentUser.following.includes(userId);
      } else {
        const currentCompany = await Company.findById(req.user._id);
        isFollowing = currentCompany.followingUsers.includes(userId);
      }
    }

    res.json({
      success: true,
      data: {
        profile: user,
        posts,
        isFollowing,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    next(error);
  }
};


export const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let updateResult;

    if (req.user.role === 'candidate') {
      // User following another user
      const currentUser = await User.findById(req.user._id);
      
      if (currentUser.following.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Already following this user'
        });
      }

      // Add to current user's following
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { following: userId }
      });

      // Add to target user's followers
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: req.user._id }
      });

    } else {
      // Company following a user
      const currentCompany = await Company.findById(req.user._id);
      
      if (currentCompany.followingUsers.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Already following this user'
        });
      }

      // Add to company's followingUsers
      await Company.findByIdAndUpdate(req.user._id, {
        $addToSet: { followingUsers: userId }
      });

      // Add to user's followers
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: req.user._id }
      });
    }

    // Get updated follower count
    const updatedUser = await User.findById(userId);
    
    res.json({
      success: true,
      message: 'Successfully followed user',
      data: {
        followersCount: updatedUser.followers.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (req.user.role === 'candidate') {
      // User unfollowing another user
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id }
      });

    } else {
      // Company unfollowing a user
      await Company.findByIdAndUpdate(req.user._id, {
        $pull: { followingUsers: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id }
      });
    }

    // Get updated follower count
    const updatedUser = await User.findById(userId);
    
    res.json({
      success: true,
      message: 'Successfully unfollowed user',
      data: {
        followersCount: updatedUser.followers.length
      }
    });
  } catch (error) {
    next(error);
  }
};