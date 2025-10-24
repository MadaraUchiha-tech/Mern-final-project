import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ username, email, password });
  return res.status(201).json({
    user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar },
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  return res.json({
    user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar },
    token: generateToken(user._id),
  });
};
