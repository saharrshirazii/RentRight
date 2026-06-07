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
  price: number;
  amenities: string[];
  images: ListingImage[];
  status: ListingStatus;
  adminFeedback?: string;
  createdAt: string;
};