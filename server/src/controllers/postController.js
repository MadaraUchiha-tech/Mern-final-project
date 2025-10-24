import { validationResult } from 'express-validator';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';

export const getPosts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { q, tag, author } = req.query;
  const filter = {};
  if (q) filter.$or = [
    { title: { $regex: q, $options: 'i' } },
    { content: { $regex: q, $options: 'i' } },
  ];
  if (tag) filter.tags = tag;
  if (author) filter.author = author;

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .populate('author', 'username avatar role')
    .lean();
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username avatar role')
    .populate({ path: 'replies', populate: { path: 'author', select: 'username avatar role' } });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, content, tags = [] } = req.body;
  const post = await Post.create({ title, content, tags, author: req.user._id });
  const populated = await post.populate('author', 'username avatar role');
  res.status(201).json(populated);
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const userId = req.user._id;
  const idx = post.likes.findIndex((id) => id.toString() === userId.toString());
  if (idx >= 0) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.json({ likes: post.likes.length, liked: idx === -1 });
};

export const addReply = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const { content, parentReply } = req.body;
  const reply = await Reply.create({ content, author: req.user._id, post: post._id, parentReply });
  post.replies.push(reply._id);
  await post.save();
  const populated = await reply.populate('author', 'username avatar role');
  res.status(201).json(populated);
};

export const likeReply = async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);
  if (!reply) return res.status(404).json({ message: 'Reply not found' });
  const userId = req.user._id;
  const idx = reply.likes.findIndex((id) => id.toString() === userId.toString());
  if (idx >= 0) reply.likes.splice(idx, 1); else reply.likes.push(userId);
  await reply.save();
  res.json({ likes: reply.likes.length, liked: idx === -1 });
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const isOwner = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not allowed' });
  await Reply.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};
