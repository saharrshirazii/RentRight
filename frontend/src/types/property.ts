

export interface Property {
  _id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  images: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number; // Check if you want to fix this typo in both places!
  category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
}