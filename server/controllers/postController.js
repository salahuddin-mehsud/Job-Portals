import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

export const createPost = async (req, res, next) => {
  try {
    const { content, media, isPublic = true } = req.body;

    const post = new Post({
      author: req.user._id,
      authorModel: req.user.role === 'candidate' ? 'User' : 'Company',
      content,
      media: media || [],
      isPublic
    });

    await post.save();
    await post.populate('author', 'name avatar');

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
    const { page = 1, limit = 10, authorId } = req.query;

    let filter = { isPublic: true };
    if (authorId) {
      filter.author = authorId;
    }

    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
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

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
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
    await comment.populate('author', 'name avatar');

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

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};