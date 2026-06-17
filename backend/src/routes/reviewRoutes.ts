import express from 'express';
import { Review } from '../models/Review';
import { verifyToken } from '../middleware/authMiddleware'; // Din middleware

const router = express.Router();

// GET reviews for a specific property
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params; // propertyId
    
    const reviews = await Review.find({ propertyId: id })
      .populate('author', 'name email')
      .sort('-createdAt');
    
    res.status(200).json(reviews);
  } catch (error: any) {
    console.error("Fel vid hämtning av recensioner:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new review for a property
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
    
    // Populate author before returning
    await newReview.populate('author', 'name email');
    
    res.status(201).json(newReview);
  } catch (error: any) {
    console.error("Fel vid skapande av recension:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;