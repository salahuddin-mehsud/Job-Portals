import User from '../models/User.js';
import Company from '../models/Company.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import { sanitizeUser, calculateMatchScore } from '../utils/helpers.js';
import mongoose from 'mongoose';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('connections', 'name avatar bio skills')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar')
      .populate('followingCompanies', 'name avatar industry')
      .populate('savedJobs', 'title company location employmentType')
      .populate('notifications');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'bio', 'skills', 'avatar', 'portfolioLinks', 'education', 'experience', 'resume'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getConnections = async (req, res, next) => {
  try {

    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, status: 'accepted' },
        { recipient: req.user._id, status: 'accepted' }
      ]
    })
    .populate('requester', 'name avatar bio skills location role')
    .populate('recipient', 'name avatar bio skills location role')
    .lean();


    res.json({
      success: true,
      data: connections
    });
  } catch (error) {
    next(error);
  }
};




export const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.body;

    if (!recipientId || !recipientType) {
      return res.status(400).json({ message: 'Recipient ID and type are required' });
    }

    const requesterModel = req.user.role === 'company' ? 'Company' : 'User';

    // Check if connection already exists (either direction)
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });

    if (existingConnection) {
      return res.status(200).json({
        success: true,
        message: 'Connection already exists',
        connection: existingConnection
      });
    }

    // Create new connection
    const connection = new Connection({
      requester: req.user._id,
      requesterModel,
      recipient: recipientId,
      recipientModel: recipientType,
      status: 'pending'
    });

    await connection.save();

    // Create notification
    const notification = new Notification({
      recipient: recipientId,
      recipientModel: recipientType,
      sender: req.user._id,
      senderModel: requesterModel,
      type: 'connection',
      title: 'New Connection Request',
      message: `${req.user.name || 'Someone'} sent you a connection request`,
      relatedEntity: connection._id,
      relatedEntityModel: 'Connection'
    });

    await notification.save();

    res.status(201).json({ success: true, message: 'Connection request sent', connection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending connection request' });
  }
};


// Accept or reject connection request
export const respondToConnectionRequest = async (req, res, next) => {
  try {
    const { connectionId, action } = req.body; // action: 'accept' or 'reject'

    if (!connectionId || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only recipient can accept/reject
    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (action === 'accept') {
      connection.status = 'accepted';
      connection.acceptedAt = new Date();
    } else {
      connection.status = 'rejected';
    }

    await connection.save();

    res.json({
      success: true,
      message: `Connection ${action}ed`,
      connection
    });
  } catch (err) {
    next(err);
  }
};


// Get pending connection requests for logged-in user

export const getPendingConnectionRequests = async (req, res, next) => {
  try {

    const requests = await Connection.find({
      recipient: req.user._id, // no need for ObjectId
      status: 'pending'
    })
      .populate('requester', 'name avatar role')
      .lean();


    res.json({ data: requests });
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    next(err);
  }
}




export const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    if (req.user.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user._id }
    });

    // Create notification
    const notification = new Notification({
      recipient: userId,
      recipientModel: 'User',
      sender: req.user._id,
      senderModel: req.user.role === 'candidate' ? 'User' : 'Company',
      type: 'follow',
      title: 'New Follower',
      message: `${req.user.name} started following you`,
      relatedEntity: req.user._id,
      relatedEntityModel: req.user.role === 'candidate' ? 'User' : 'Company'
    });

    await notification.save();

    res.json({
      success: true,
      message: 'Successfully followed user'
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { query, skills, location, page = 1, limit = 10 } = req.query;

    let searchFilter = {};

    if (query) {
      searchFilter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim().toLowerCase());
      searchFilter.skills = { $in: skillsArray };
    }

    if (location) {
      searchFilter.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(searchFilter)
      .select('name avatar bio skills location education experience')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};