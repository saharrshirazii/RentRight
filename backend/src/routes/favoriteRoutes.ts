import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavoriteStatus } from '../controllers/favoriteController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Kräver inloggning för alla favorit-endpoints
router.use(verifyToken); 

router.route('/')
    .get(getFavorites)
    .post(addFavorite);

router.route('/:propertyId')
    .delete(removeFavorite);

router.route('/check/:propertyId')
    .get(checkFavoriteStatus);

export default router;