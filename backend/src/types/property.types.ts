export interface IProperty {
    _id: string;
    title: string;
    location: string;
    pricePerNight: number;
    rating: number;
    reviews: number;
    images: string[]; // Array of image URLs/paths
    guests: number;
    bedrooms: number;
    bathrooms: number;
    category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
    owner: string;
}