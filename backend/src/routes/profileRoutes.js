import express from 'express';
import auth from '../middleware/auth.js';
import { getMe } from '../controllers/authController.js';
import { getUserSkills, addUserSkill, removeUserSkill, updateProfile } from '../controllers/skillController.js';

const router = express.Router();

router.get('/me',                       auth, getMe);
router.put('/update',                   auth, updateProfile);
router.get('/skills',                   auth, getUserSkills);
router.post('/skills',                  auth, addUserSkill);
router.delete('/skills/:skillId/:type', auth, removeUserSkill);

export default router;