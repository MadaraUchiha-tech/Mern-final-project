import { body, param, query } from 'express-validator';

export const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
];

export const likePostValidation = [
  param('id').isMongoId().withMessage('Invalid post id'),
];

export const addReplyValidation = [
  param('id').isMongoId().withMessage('Invalid post id'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('parentReply').optional().isMongoId().withMessage('Invalid parent reply id'),
];

export const getPostsValidation = [
  query('q').optional().isString(),
  query('tag').optional().isString(),
  query('author').optional().isString(),
];
