import express from 'express';
import { Review } from '../models/Review';
import { verifyToken } from '../middleware/authMiddleware'; // Din middleware
import mongoose from 'mongoose';

const router = express.Router();

router.post('/:id/reviews', verifyToken, async (req, res) => {
  console.log("DEBUG: POST-anrop mottaget för property:", req.params.id);
  console.log("DEBUG: Body:", req.body);
  try {
    const { comment, rating } = req.body;
    const { id } = req.params;
    const authorId = req.user?.id;

    if (!authorId) return res.status(401).json({ message: "Användare saknas" });
    if (!comment) return res.status(400).json({ message: "Kommentar saknas" });

    const newReview = new Review({
      propertyId: new mongoose.Types.ObjectId(id), // Tvinga ObjectId här
      author: new mongoose.Types.ObjectId(authorId),
      rating: rating || null,
      comment: comment
    });

    // 1. Validera manuellt INNAN vi sparar
    const validationError = newReview.validateSync();
    if (validationError) {
      console.error("VALIDERINGSFEL:", validationError);
      return res.status(400).json({ error: validationError.message });
    }

    // 2. Om valideringen går igenom, spara
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error: any) {
    console.error("KRITISKT SYSTEMFEL:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;