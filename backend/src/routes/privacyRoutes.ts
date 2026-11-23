import { Router } from 'express';
import { exportUserData, deleteUserAccount } from '../controllers/privacyController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Vi lägger på authMiddleware här så att alla rutter i denna fil 
// kräver att användaren är inloggad
router.use(verifyToken);

// Här kopplar vi sökvägarna till kontrollern
router.get('/export', exportUserData);
router.delete('/delete', deleteUserAccount);

export default router;