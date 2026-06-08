
import { ReactNode } from 'react';

export type PropertyImage = string | {
  id?: string;
  originalName?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  url: string;
};

export interface Property {
  _id: string;
  id?: string;
  title: string;
  location: string;
  description?: string;
  pricePerNight: number;
  price?: number;
  rating: number;
  reviews: number;
  reviewsCount?: number;
  images: PropertyImage[];
  guests: number;
  bedrooms: number;
  bathrooms: number; 
  category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
  owner?: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  };
}

//------------Property Detail----------------//
export interface PropertyOwner {
  _id: string;
  name: string;
  email: string;
}

export interface Review {
  date: ReactNode;
  _id: string;
  author: string;
  avatar?: string;
  data: string;
  rating: number;
  comment: string;
  hostReplay?:string;

}

export interface PropertyData {
  _id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number; // renamed to contrast with reviews array
  images: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
  owner: PropertyOwner;
  amenities?: string[]; // New optional field matching your UI
  reviewsList?: Review[]; // New optional field matching your UI
}
