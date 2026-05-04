export type ListingImage = {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

export type Listning = {
  id: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
  createdAt: string;
};
