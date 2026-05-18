export type Experience = "host" | "explore";

export type TabId =
  | "boende"
  | "bokningar"
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

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
  createdAt: string;
};