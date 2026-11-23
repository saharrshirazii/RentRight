import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Database Document
export interface IProperty extends Document {
    title: string;
    location: string;
    pricePerNight: number;
    rating: number;
    reviews: number;
    images: string[]; 
    guests: number;
    bedrooms: number;
    bathrooms: number;
    category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
    owner: mongoose.Types.ObjectId; // Links to your User model
   

}

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  images: [{ type: String, required: true }],
  guests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Lägenhet', 'Villa', 'Stuga', 'Radhus', 'Studio'],
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);