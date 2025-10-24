import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidators.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);

export default router;
