import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "company";
    if (file.fieldname === "logo") folder = "company/logo";
    if (file.fieldname === "culturePhotos") folder = "company/culturePhotos";

    return {
      folder,
      resource_type: "auto", // auto handles image/pdf/video
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Save or update company profile
router.post(
  "/profile",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "culturePhotos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user || user.role !== "company") {
        return res
          .status(403)
          .json({ message: "Access denied. Not a company." });
      }

      // Extract text fields
      const {
        name,
        industry,
        size,
        website,
        description,
        headquarters,
        foundingYear,
        employeeCount,
        contactName,
        contactEmail,
        contactPhone,
        contactPosition,
        billingPlan,
        paymentMethod,
        billingAddress,
        billingCity,
        billingState,
        billingZip,
        billingCountry,
        colors,
      } = req.body;

      const companyProfile = {
        name,
        industry,
        size,
        website,
        description,
        headquarters,
        foundingYear: foundingYear ? parseInt(foundingYear) : undefined,
        employeeCount: employeeCount ? parseInt(employeeCount) : undefined,
        contactName,
        contactEmail,
        contactPhone,
        contactPosition,
        billingPlan,
        paymentMethod,
        billingAddress,
        billingCity,
        billingState,
        billingZip,
        billingCountry,
        colors: typeof colors === "string" ? JSON.parse(colors) : colors || {},
      };

      // ✅ Handle Cloudinary file uploads
      if (req.files) {
        if (req.files.logo && req.files.logo[0]) {
          companyProfile.logoUrl = req.files.logo[0].path; // Cloudinary URL
        }

        if (req.files.culturePhotos && req.files.culturePhotos.length > 0) {
          companyProfile.culturePhotos = req.files.culturePhotos.map(
            (file) => file.path // Cloudinary URLs
          );

          if (req.body.culturePhotosCaptions) {
            companyProfile.culturePhotosCaptions =
              typeof req.body.culturePhotosCaptions === "string"
                ? JSON.parse(req.body.culturePhotosCaptions)
                : req.body.culturePhotosCaptions;
          }
        }
      }

      // Save to DB
      user.companyProfile = companyProfile;
      await user.save();

      res.json({ message: "Company profile saved successfully", user });
    } catch (error) {
      console.error("Error saving company profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
