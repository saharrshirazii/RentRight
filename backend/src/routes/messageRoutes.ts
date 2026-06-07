import { Router } from 'express';
import { sendMessage, getConversation, getInbox, getAllMessages } from '../controllers/messageController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, sendMessage);
router.get('/inbox', verifyToken, getInbox);
router.get('/all', verifyToken, getAllMessages);
router.get('/:userId', verifyToken, getConversation);

export default router;