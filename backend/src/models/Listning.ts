import mongoose, { Schema, Document } from 'mongoose';
import { ListingImage } from '../types';

export interface IListning extends Document {
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
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
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    amenities: { type: [String], default: [] },
    images: { type: [ListingImageSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<IListning>('Listning', ListningSchema);
