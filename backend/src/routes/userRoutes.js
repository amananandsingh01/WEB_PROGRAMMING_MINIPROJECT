import express from 'express';
import { searchUsers, getUserProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/search
router.get('/search', auth, searchUsers);

// GET /api/users/:id
router.get('/:id', auth, getUserProfile);

export default router;