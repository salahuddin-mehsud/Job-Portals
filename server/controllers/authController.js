import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateToken, sanitizeUser, verifyToken } from '../utils/helpers.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, name } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ email });
    let existingCompany = await Company.findOne({ email });
    if (existingUser || existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user or company
    let entity;
    if (role === 'candidate') {
      entity = new User({ name, email, password, role });
    } else {
      entity = new Company({ name, email, password, role });
    }

    await entity.save();

    // Generate token
    const token = generateToken(entity._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: sanitizeUser(entity),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check in both User and Company collections
    let entity = await User.findOne({ email }).select('+password');
    if (!entity) {
      entity = await Company.findOne({ email }).select('+password');
    }

    if (!entity) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await entity.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(entity._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(entity),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Verify token and update user/company
    const decoded = verifyToken(token);
    
    let entity = await User.findById(decoded.userId);
    if (!entity) {
      entity = await Company.findById(decoded.userId);
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    entity.isVerified = true;
    entity.verificationToken = undefined;
    await entity.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    let entity = await User.findOne({ email });
    if (!entity) {
      entity = await Company.findOne({ email });
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // Generate reset token
    const resetToken = generateToken(entity._id);
    
    // Save reset token to entity
    entity.resetPasswordToken = resetToken;
    entity.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await entity.save();

    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken // ⚠️ NOTE: in production don’t send token in response, just for now since no email system
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    let entity = await User.findOne({ 
      _id: decoded.userId, 
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!entity) {
      entity = await Company.findOne({ 
        _id: decoded.userId, 
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });
    }

    if (!entity) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    entity.password = newPassword;
    entity.resetPasswordToken = undefined;
    entity.resetPasswordExpire = undefined;
    await entity.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
