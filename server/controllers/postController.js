// controllers/postController.js
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { cloudinary } from '../config/cloudinary.js';



export const createPost = async (req, res, next) => {
  try {
    const { content, media = [], isPublic = true } = req.body;

    const post = new Post({
      author: req.user._id,
      authorModel: req.user.role === 'candidate' ? 'User' : 'Company',
      content,
      media: media || [],
      isPublic
    });

    await post.save();
    await post.populate('author', 'name avatar');

    // Add post reference to author
    if (req.user.role === 'candidate') {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { posts: post._id }
      });
    } else {
      await Company.findByIdAndUpdate(req.user._id, {
        $push: { posts: post._id }
      });
    }

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, authorId, feed = false } = req.query;

    let filter = { isPublic: true };
    
    if (authorId) {
      filter.author = authorId;
    }

    // If it's a feed request, show posts from followed users/companies
    if (feed && req.user) {
      let followingIds = [];
      
      if (req.user.role === 'candidate') {
        const user = await User.findById(req.user._id).select('following followingCompanies');
        followingIds = [
          ...(user.following || []),
          ...(user.followingCompanies || [])
        ];
      } else {
        const company = await Company.findById(req.user._id).select('followingUsers followingCompanies');
        followingIds = [
          ...(company.followingUsers || []),
          ...(company.followingCompanies || [])
        ];
      }
      
      // Include user's own posts and posts from people they follow
      filter.$or = [
        { author: req.user._id },
        { author: { $in: followingIds } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'name avatar role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar role'
        },
        options: { sort: { createdAt: -1 } }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// controllers/postController.js - TEMPORARY FIX
// controllers/postController.js (replace uploadImage with this)
export const uploadImage = async (req, res, next) => {
  try {
    console.log('Upload image request received');

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size ?? (req.file.buffer ? req.file.buffer.length : undefined)
    });

    // If multer-storage-cloudinary or a similar storage already uploaded the file,
    // req.file.path often contains the secure URL and req.file.filename is publicId.
    if (req.file.path && typeof req.file.path === 'string' && req.file.path.startsWith('http')) {
      console.log('File already uploaded by storage engine. Returning existing URL.');
      return res.json({
        success: true,
        data: {
          url: req.file.path,
          publicId: req.file.filename || null
        }
      });
    }

    // Ensure it's an image
    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }

    // If we have a buffer (memoryStorage), convert to base64 data URI and upload
    if (!req.file.buffer) {
      console.log('No buffer found on req.file — cannot upload from memory');
      return res.status(400).json({
        success: false,
        message: 'File upload is not available in expected format'
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary via data URI (base64)...');

    // Use the cloudinary instance imported from config
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'proconnect/posts',
      resource_type: 'image',
      timeout: 60000 // 60s
    });

    console.log('Cloudinary upload successful:', result.secure_url);

    return res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    // Log detailed error for debugging
    console.error('Upload error details:', error);

    // cloudinary errors sometimes include `error.http_code` or `error.message`
    const errMsg = error?.message || 'Unknown upload error';

    return res.status(500).json({
      success: false,
      message: `Failed to upload image: ${errMsg}`
    });
  }
};


export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar role'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already liked
    const alreadyLiked = post.likes.some(
      like => like.entity.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.entity.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push({
        entity: req.user._id,
        model: req.user.role === 'candidate' ? 'User' : 'Company'
      });

      // Create notification if not liking own post
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          recipient: post.author,
          recipientModel: post.authorModel,
          sender: req.user._id,
          senderModel: req.user.role === 'candidate' ? 'User' : 'Company',
          type: 'like',
          title: 'New Like',
          message: `${req.user.name} liked your post`,
          relatedEntity: post._id,
          relatedEntityModel: 'Post'
        });
        await notification.save();
      }
    }

    await post.save();
    await post.populate('author', 'name avatar role');

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const { content, parentComment } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new Comment({
      post: post._id,
      author: req.user._id,
      authorModel: req.user.role === 'candidate' ? 'User' : 'Company',
      content,
      parentComment
    });

    await comment.save();
    await comment.populate('author', 'name avatar role');

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // Create notification if not commenting on own post
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        recipientModel: post.authorModel,
        sender: req.user._id,
        senderModel: req.user.role === 'candidate' ? 'User' : 'Company',
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.name} commented on your post`,
        relatedEntity: post._id,
        relatedEntityModel: 'Post'
      });
      await notification.save();
    }

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Remove post reference from author
    if (req.user.role === 'candidate') {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { posts: post._id }
      });
    } else {
      await Company.findByIdAndUpdate(req.user._id, {
        $pull: { posts: post._id }
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};