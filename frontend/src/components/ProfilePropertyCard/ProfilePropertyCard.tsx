import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { StarIcon } from '@heroicons/react/20/solid';

interface Props {
  property: any;
  onRemove: (id: string, e: React.MouseEvent) => void;
}

export default function ProfilePropertyCard({ property, onRemove }: Props) {
  // Handle image URLs - supports both string URLs and objects with url property
  const formatImgUrl = (url: any) => {
    if (!url) return 'https://via.placeholder.com/400';
    
    // Handle image objects with url property
    if (typeof url === 'object' && url.url) {
      url = url.url;
    }
    
    if (typeof url !== 'string') return 'https://via.placeholder.com/400';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `http://localhost:3000${url}`;
    return `http://localhost:3000/${url}`;
  };

  const imageUrl = property.images && Array.isArray(property.images) && property.images.length > 0
    ? formatImgUrl(property.images[0])
    : 'https://via.placeholder.com/400';

  // Calculate average rating from reviews
  const reviews = property.reviewsList || property.reviews || [];
  const ratedReviews = reviews.filter((r: any) => r.rating);
  const avgRating = ratedReviews.length > 0
    ? (ratedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / ratedReviews.length).toFixed(1)
    : null;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Bildlänk */}
      <Link to={`/properties/${property._id}`} className='relative h-48 overflow-hidden block'>
        <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase">
          {property.category}
        </div>
      </Link>

      {/* Kortinnehåll */}
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start">
          <Link to={`/properties/${property._id}`} className="hover:underline block grow max-w-[80%]">
            <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
          </Link>
        
        </div>

        <p className="text-xs text-gray-500 mt-1">{property.location}</p>

        {/* Rating display */}
        {avgRating && (
          <div className="flex items-center gap-1 mt-2">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-semibold text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-400">({ratedReviews.length} recensioner)</span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 py-2 border-b border-gray-200 text-gray-500 text-[11px]">
          <span>{property.guests} gäster</span>
          <span>{property.bedrooms} rum</span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-gray-900">{property.pricePerNight || property.price} kr</span>
            <span className="text-gray-400 text-xs">/ natt</span>
          </div>

          {/* Knappen för att ta bort favorit */}
          <button 
            onClick={(e) => onRemove(property._id, e)}
            className="p-2 rounded-full border border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Ta bort från sparade"
          >
            <HiHeart className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}