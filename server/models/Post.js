import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'authorModel' },
  authorModel: { type: String, required: true, enum: ['User', 'Company'] },
  content: { type: String, required: true },
  media: [{ type: String }], // URLs to images/videos
  likes: [{
    entity: { type: mongoose.Schema.Types.ObjectId, refPath: 'likes.model' },
    model: { type: String, enum: ['User', 'Company'] },
    likedAt: { type: Date, default: Date.now }
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  shares: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);