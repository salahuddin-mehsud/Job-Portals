import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get public profile by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // First, get the user document
    let user = await User.findById(userId)
      .select('-password -email -companyProfile.contactEmail -companyProfile.contactPhone');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For companies, we need to manually populate companyProfile.followers
    if (user.role === 'company') {
      user = await User.findById(userId)
        .select('-password -email -companyProfile.contactEmail -companyProfile.contactPhone')
        .lean(); // Convert to plain object
      
      if (user.companyProfile.followers && user.companyProfile.followers.length > 0) {
        const followers = await User.find({ 
          _id: { $in: user.companyProfile.followers } 
        }).select('fullName profilePicture professionalTitle').lean();
        
        user.companyProfile.followers = followers;
      } else {
        user.companyProfile.followers = [];
      }
    } else {
      // For regular users, use populate
      user = await User.findById(userId)
        .select('-password -email -companyProfile.contactEmail -companyProfile.contactPhone')
        .populate('followers', 'fullName profilePicture professionalTitle')
        .populate('followingUsers', 'fullName profilePicture professionalTitle')
        .populate('followingCompanies', 'fullName companyProfile.name companyProfile.logoUrl')
        .lean();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;