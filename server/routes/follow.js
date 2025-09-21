import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Follow a company or user
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user._id;
    
    // Check if target exists
    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: 'User or company not found' });
    }
    
    // Check if already following
    const user = await User.findById(userId);
    
    if (target.role === 'company') {
      // Check if already following this company
      if (user.followingCompanies.includes(targetId)) {
        return res.status(400).json({ message: 'Already following this company' });
      }
      
      // Add to user's followingCompanies
      user.followingCompanies.push(targetId);
      await user.save();
      
      // Add to company's followers
      target.companyProfile.followers.push(userId);
      await target.save();
      
      res.json({ message: 'Successfully followed company' });
    } else {
      // Check if already following this user
      if (user.followingUsers.includes(targetId)) {
        return res.status(400).json({ message: 'Already following this user' });
      }
      
      // Add to user's followingUsers
      user.followingUsers.push(targetId);
      await user.save();
      
      // Add to target user's followers
      target.followers.push(userId);
      await target.save();
      
      res.json({ message: 'Successfully followed user' });
    }
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a company or user
router.post('/unfollow/:id', protect, async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user._id;
    
    // Check if target exists
    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: 'User or company not found' });
    }
    
    // Remove from user's following
    const user = await User.findById(userId);
    
    if (target.role === 'company') {
      user.followingCompanies = user.followingCompanies.filter(
        id => id.toString() !== targetId
      );
      await user.save();
      
      // Remove from company's followers
      target.companyProfile.followers = target.companyProfile.followers.filter(
        id => id.toString() !== userId.toString()
      );
      await target.save();
      
      res.json({ message: 'Successfully unfollowed company' });
    } else {
      user.followingUsers = user.followingUsers.filter(
        id => id.toString() !== targetId
      );
      await user.save();
      
      // Remove from target user's followers
      target.followers = target.followers.filter(
        id => id.toString() !== userId.toString()
      );
      await target.save();
      
      res.json({ message: 'Successfully unfollowed user' });
    }
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's follow status
router.get('/follow-status/:id', protect, async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    const isFollowing = user.followingCompanies.includes(targetId) || 
                       user.followingUsers.includes(targetId);
    
    res.json({ isFollowing });
  } catch (error) {
    console.error('Follow status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's followers and following counts
router.get('/follow-counts/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let followersCount = 0;
    let followingCount = 0;
    
    if (user.role === 'company') {
      followersCount = user.companyProfile.followers.length;
      // For companies, we don't track who they follow in this implementation
    } else {
      followersCount = user.followers.length;
      followingCount = user.followingCompanies.length + user.followingUsers.length;
    }
    
    res.json({ followersCount, followingCount });
  } catch (error) {
    console.error('Follow counts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;