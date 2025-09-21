import express from "express";
import Application from "../models/Application.js";
import { protect, userOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Apply for a job (User only)
router.post("/:jobId", protect, userOnly, async (req, res) => {
  try {
    const existingApp = await Application.findOne({ job: req.params.jobId, user: req.user._id });
    if (existingApp) return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      job: req.params.jobId,
      user: req.user._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update application status (Company only)
router.put("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    application.status = req.body.status || application.status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
