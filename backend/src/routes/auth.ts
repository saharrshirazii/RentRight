import { Router } from 'express';
import { register, login, switchRole, changePassword } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/switch-role', verifyToken, switchRole);
router.post('/change-password', verifyToken, changePassword);

export default router;