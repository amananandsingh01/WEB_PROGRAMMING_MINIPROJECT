import express from 'express';
import { getRequests, createRequest, updateRequestStatus, cancelRequest } from '../controllers/requestController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getRequests);
router.post('/', auth, createRequest);
router.put('/:id', auth, updateRequestStatus);
router.delete('/:id', auth, cancelRequest);

export default router;