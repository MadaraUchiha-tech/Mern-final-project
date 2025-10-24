import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Reply = mongoose.model('Reply', replySchema);
export default Reply;
