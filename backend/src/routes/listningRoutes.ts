import { Router } from 'express';
import { addListning, editListning, listListnings, removeListning } from '../controllers/listningController';
import { uploadListingImages } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', listListnings);
router.post('/', uploadListingImages, addListning);
router.put('/:id', uploadListingImages, editListning);
router.delete('/:id', removeListning);

export default router;
