import MysigstugaIGoteborg from "../assets/MysigstugaIGoteborg.jpg";
import MysigLagenhetIStockholm from '../assets/MysigLagenhetIStockholm.jpg';
import VackertRadhusIMalmo from '../assets/VackertRadhusIMalmo.jpg';
import MysigVillaIOrebro from '../assets/MysigVillaIOrebro.jpg';
import MysigVillaIStockholm from '../assets/MysigVillaIStockholm.jpg';
import MysigStudioIonkoping from '../assets/MysigStudioIonkoping.jpg';

export interface Property {
    id: string,
    title: string,
    price: number,
    location: string,
    rating: number;
    reviews: number;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    image: string;
    category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
}

export const propertyData: Property[] = [
        {
    id: '1',
    title: 'Mysig Stuga i Göteborg',
    location: 'Göteborg, Sverige',
    price: 1200,
    rating: 4.9,
    reviews: 40,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    image: MysigstugaIGoteborg,
    category: 'Stuga'
  },
  {
    id: '2',
    title: 'Mysig lägenhet i Stockholm',
    location: 'Stockholm, Sverige',
    price: 1400,
    rating: 4.8,
    reviews: 36,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: MysigLagenhetIStockholm,
    category: 'Lägenhet'
  },
  {
    id: '3',
    title: 'Vackert Radhus i Malmö',
    location: 'Malmö, Sverige',
    price: 1000,
    rating: 4.7,
    reviews: 11,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: VackertRadhusIMalmo,
    category: 'Radhus'
  },
  {
    id: '4',
    title: 'Mysig Villa i Örebro',
    location: 'Örebro, Sverige',
    price: 1100,
    rating: 4.6,
    reviews: 27,
    guests: 6,
    bedrooms: 3,
    bathrooms: 1,
    image: MysigVillaIOrebro,
    category: 'Villa'
  },
  {
    id: '5',
    title: 'Mysig Villa i Stockholm',
    location: 'Stockholm, Sverige',
    price: 1600,
    rating: 4.9,
    reviews: 22,
    guests: 8,
    bedrooms: 4,
    bathrooms: 2,
    image: MysigVillaIStockholm,
    category: 'Villa'
  },
  {
    id: '6',
    title: 'Mysig Studio i Jönköping',
    location: 'Jönköping, Sverige',
    price: 1300,
    rating: 4.8,
    reviews: 30,
    guests: 2,
    bedrooms: 0,
    bathrooms: 1,
    image: MysigStudioIonkoping,
    category: 'Studio'
  }
];