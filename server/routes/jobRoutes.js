import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, roleAuthorization } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all jobs (Public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("company", "name");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new job (Company only)
router.post("/", protect, roleAuthorization(["company"]), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get jobs for logged-in company
router.get("/my-jobs", protect, roleAuthorization(["company"]), async (req, res) => {
  const jobs = await Job.find({ company: req.user._id });
  res.json(jobs);
});

// @desc    Get applications for a job
router.get("/:id/applications", protect, roleAuthorization(["company"]), async (req, res) => {
  const applications = await Application.find({ job: req.params.id }).populate("user", "name email");
  res.json(applications);
});

export default router;