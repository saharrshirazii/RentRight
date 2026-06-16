// backend/src/models/Review.ts
import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, required: true },
  hostReply: { type: String },
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);