import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { StarIcon } from '@heroicons/react/20/solid';

interface Props {
  property: any;
  onRemove: (id: string, e: React.MouseEvent) => void;
}

export default function ProfilePropertyCard({ property, onRemove }: Props) {
  // Här säkerställer vi att bild-URLen blir rätt
const imageUrl = property.images?.[0]?.filename 
    ? `http://localhost:3000/uploads/${property.images[0].filename}` 
    : 'https://via.placeholder.com/400';

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
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <Link to={`/properties/${property._id}`} className="hover:underline block flex-grow max-w-[80%]">
            <h3 className="font-bold text-gray-900 truncate">{property.title}</h3>
          </Link>
        
        </div>

        <p className="text-xs text-gray-500 mt-1">{property.location}</p>

        <div className="flex items-center gap-4 mt-4 py-2 border-b border-gray-200 text-gray-500 text-[11px]">
          <span>{property.guests} gäster</span>
          <span>{property.bedrooms} rum</span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-gray-900">{property.pricePerNight} kr</span>
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