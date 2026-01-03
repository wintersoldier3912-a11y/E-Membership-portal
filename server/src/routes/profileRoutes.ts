
// Fix: Use ES Modules instead of CommonJS to resolve 'require' and 'module' errors in TypeScript files.
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getProfile);
router.patch('/', protect, updateProfile);

export default router;
