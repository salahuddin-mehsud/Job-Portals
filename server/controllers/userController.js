import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    user.fullName = req.body.fullName || user.fullName;
    user.professionalTitle = req.body.professionalTitle || user.professionalTitle;

    // Parse structured fields from FormData
    if (req.body.education) {
      try {
        user.education = JSON.parse(req.body.education);
      } catch (error) {
        console.error("Error parsing education:", error);
      }
    }
    
    if (req.body.socialLinks) {
      try {
        user.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (error) {
        console.error("Error parsing social links:", error);
      }
    }

    // Handle file uploads
    if (req.files) {
      // Profile picture
      if (req.files.profilePicture) {
        // Delete old profile picture if exists
        if (user.profilePicture) {
          const oldPath = path.join(process.cwd(), user.profilePicture);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        user.profilePicture = req.files.profilePicture[0].path;
      }

      // Resume
      if (req.files.resume) {
        // Delete old resume if exists
        if (user.resumeUrl) {
          const oldPath = path.join(process.cwd(), user.resumeUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        user.resumeUrl = req.files.resume[0].path;
      }

      // Certificates
      if (req.files.certificates) {
        // Add new certificates
        const newCertificates = req.files.certificates.map(file => ({
          name: file.originalname,
          fileUrl: file.path,
          issuedBy: 'Unknown',
          date: new Date()
        }));
        user.certificates = user.certificates.concat(newCertificates);
      }
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a certificate
export const deleteCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const certificateId = req.params.certificateId;
    const certificate = user.certificates.id(certificateId);
    
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Delete file from server
    if (certificate.fileUrl) {
      const filePath = path.join(process.cwd(), certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove certificate from array
    user.certificates.pull(certificateId);
    await user.save();

    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error("Delete certificate error:", err);
    res.status(500).json({ message: err.message });
  }
};