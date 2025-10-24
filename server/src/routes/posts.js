import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  likePost,
  addReply,
  likeReply,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import {
  addReplyValidation,
  createPostValidation,
  getPostsValidation,
  likePostValidation,
} from '../validators/postValidators.js';
import { validationResult, param } from 'express-validator';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', getPostsValidation, handleValidation, getPosts);
router.get('/:id', param('id').isMongoId(), handleValidation, getPostById);
router.post('/', protect, createPostValidation, handleValidation, createPost);
router.patch('/:id/like', protect, likePostValidation, handleValidation, likePost);
router.post('/:id/reply', protect, addReplyValidation, handleValidation, addReply);
router.patch('/:postId/replies/:replyId/like', protect, param('postId').isMongoId(), param('replyId').isMongoId(), handleValidation, likeReply);
router.delete('/:id', protect, param('id').isMongoId(), handleValidation, deletePost);

export default router;
