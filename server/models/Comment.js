import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'authorModel' },
  authorModel: { type: String, required: true, enum: ['User', 'Company'] },
  content: { type: String, required: true },
  likes: [{
    entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'likes.model' },
    model: { type: String, enum: ['User', 'Company'] },
    likedAt: { type: Date, default: Date.now }
  }],
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // for nested comments
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);