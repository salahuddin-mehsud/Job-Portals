import express from "express";
import { protect, roleAuthorization } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User-only dashboard
router.get(
  "/job-seeker-dashboard",
  protect,
  roleAuthorization(["user"]),
  (req, res) => {
    res.json({
      message: "Welcome to the Job Seeker Dashboard",
      user: req.user,
    });
  }
);

// ✅ Company-only dashboard
router.get(
  "/job-posting-creation-management",
  protect,
  roleAuthorization(["company"]),
  (req, res) => {
    res.json({
      message: "Welcome to the Company Dashboard",
      user: req.user,
    });
  }
);

export default router;
