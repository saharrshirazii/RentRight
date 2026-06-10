export type Experience = "host" | "explore";

export type TabId =
  | "boende"
  | "bokningar"
  | "meddelanden"
  | "tillganglighet"
  | "prissattning"
  | "recensioner"
  | "statistik";

export type ListingImage = {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

export type ListingStatus = 'pending' | 'approved' | 'needs_revision' | 'rejected';

export type Listing = {
  id: string;
  _id?: string;
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
  createdAt: string;
};
