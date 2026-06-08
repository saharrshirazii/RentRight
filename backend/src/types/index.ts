export type ListingImage = {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

export type ListingStatus = 'pending' | 'approved' | 'needs_revision' | 'rejected';

export type Listning = {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: ListingImage[];
  status: ListingStatus;
  adminFeedback?: string;
  createdAt: string;
};
