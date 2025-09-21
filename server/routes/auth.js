import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, professionalTitle, password, role  } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ fullName, email, professionalTitle, role ,password });

    res.status(201).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        professionalTitle: user.professionalTitle,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    let isMatch = false;

    // Case 1: Compare with hashed password
    if (user.password.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Case 2: Password stored in plain text
      isMatch = password === user.password;
    }

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        professionalTitle: user.professionalTitle,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Social Auth Simulation
router.post("/social", async (req, res) => {
  try {
    const { email, name, provider } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName: name, email, provider, password: "sociallogin" });
    }

    res.json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        provider: user.provider
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
