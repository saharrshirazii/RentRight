import { Router } from 'express';
import { addListning, editListning, getListning, listApprovedListnings, listListnings, removeListning, reviewListning, getReviews } from '../controllers/listningController';
import { uploadListingImages } from '../middleware/uploadMiddleware';
import { verifyToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';

const router = Router();


router.get('/approved', listApprovedListnings);

router.get('/', listListnings);

router.get('/:id', getListning);

router.get('/:id/reviews', getReviews);


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


router.patch(
    '/:id/review',
    verifyToken,
    checkRole(['admin']),
    reviewListning
);


router.delete(
    '/:id', 
    verifyToken, 
    checkRole(['host', 'admin']),
    removeListning
);

export default router;
