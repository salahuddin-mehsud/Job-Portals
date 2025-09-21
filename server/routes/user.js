import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteCertificate,
} from "../controllers/userController.js";
import User from "../models/User.js"; // Make sure this import exists

const router = express.Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "portfolio";
    let resource_type = "image";

    if (file.fieldname === "resume" || file.fieldname === "certificates") {
      resource_type = "raw";
    }

    return {
      folder,
      resource_type,
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update profile endpoint
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]),
  updateUserProfile
);

// Delete certificate endpoint
router.delete("/certificate/:certificateId", protect, deleteCertificate);

// Get public profile by ID - ADD THIS ROUTE
router.get('/public/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Fetch user but exclude sensitive information
    const user = await User.findById(userId)
      .select('-password -email -companyProfile.contactEmail -companyProfile.contactPhone')
      .populate('followers', 'fullName profilePicture professionalTitle')
      .populate('followingUsers', 'fullName profilePicture professionalTitle')
      .populate('followingCompanies', 'fullName companyProfile.name companyProfile.logoUrl');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;