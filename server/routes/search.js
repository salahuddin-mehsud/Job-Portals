import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search users and companies

// In routes/search.js
router.get('/', async (req, res) => {
  try {
    const { q, type, industry, skill, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by type (user or company)
    if (type) {
      query.role = type;
    }
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Filter by industry (for companies)
    if (industry && (type === 'company' || !type)) {
      query['companyProfile.industry'] = new RegExp(industry, 'i');
    }
    
    // Filter by skill (for users)
    if (skill && (type === 'user' || !type)) {
      query.skills = new RegExp(skill, 'i');
    }
    
    // Execute search
    const results = await User.find(query)
      .select('-password -email -companyProfile.contactEmail -companyProfile.contactPhone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      results,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular companies
router.get('/popular-companies', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularCompanies = await User.aggregate([
      { $match: { role: 'company' } },
      {
        $addFields: {
          followersCount: { $size: '$companyProfile.followers' }
        }
      },
      { $sort: { followersCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          fullName: 1,
          'companyProfile.name': 1,
          'companyProfile.industry': 1,
          'companyProfile.logoUrl': 1,
          followersCount: 1
        }
      }
    ]);
    
    res.json(popularCompanies);
  } catch (error) {
    console.error('Popular companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get suggested users to follow
router.get('/suggested-users', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;
    
    const user = await User.findById(userId);
    
    // Exclude users already followed and current user
    const excludeIds = [...user.followingUsers, userId];
    
    const suggestedUsers = await User.aggregate([
      { 
        $match: { 
          role: 'user', 
          _id: { $nin: excludeIds } 
        } 
      },
      { $sample: { size: parseInt(limit) } },
      {
        $project: {
          fullName: 1,
          professionalTitle: 1,
          profilePicture: 1,
          skills: 1,
          followersCount: { $size: '$followers' }
        }
      }
    ]);
    
    res.json(suggestedUsers);
  } catch (error) {
    console.error('Suggested users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;