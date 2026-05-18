import { Router } from 'express';
import { addListning, editListning, listListnings, removeListning } from '../controllers/listningController';
import { uploadListingImages } from '../middleware/uploadMiddleware';
import { verifyToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', listListnings);

router.post(
    '/', 
    verifyToken, 
    checkRole(['host', 'admin']), 
    uploadListingImages, 
    addListning
);

router.put(
    '/:id',
    verifyToken,
    checkRole(['host', 'admin']),
    uploadListingImages, 
    editListning
);

router.delete(
    '/:id', 
    verifyToken, 
    checkRole(['admin']), 
    removeListning
);

export default router;