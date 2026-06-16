import express from 'express';
import { Review } from '../models/Review';
import { verifyToken } from '../middleware/authMiddleware'; // Din middleware

const router = express.Router();

router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const { id } = req.params; // propertyId
    
    // Vi hämtar användar-ID från req.user 
    const authorId = req.user?.id; 

    if (!authorId) {
      return res.status(401).json({ message: "Kunde inte identifiera användaren" });
    }

    const newReview = new Review({
      propertyId: id,
      author: authorId, // Mappar mot author i ditt schema
      rating: rating || null,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error: any) {
    console.error("Fel vid skapande av recension:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;