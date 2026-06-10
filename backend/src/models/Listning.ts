import mongoose, { Schema, Document } from 'mongoose';
import { ListingImage } from '../types';


export type ListingStatus = 'pending' | 'approved' | 'needs_revision' | 'rejected';

export interface IListning extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: ListingImage[];
  propertyType: 'Lägenhet' | 'Radhus' | 'Studio' | 'Stuga' | 'Villa';
  status: ListingStatus;
  adminFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListingImageSchema = new Schema<ListingImage>(
  {
    id: { type: String, required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const ListningSchema = new Schema<IListning>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, min: 1, max: 20 },
    bedrooms: { type: Number, required: true, min: 0, max: 20 },
    bathrooms: { type: Number, required: true, min: 0, max: 20 },
    amenities: { type: [String], default: [] },
    images: { type: [ListingImageSchema], default: [] },
    propertyType: {
      type: String,
      enum: ['Lägenhet', 'Radhus', 'Studio', 'Stuga', 'Villa'],
      default: 'Lägenhet',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'needs_revision', 'rejected'],
      default: 'pending',
      required: true
    },
    adminFeedback: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true },
);

export default mongoose.model<IListning>('Listning', ListningSchema);
