import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon, HomeIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { Property, propertyData } from '../../types/property';


export default function PropertyGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {propertyData.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </div>
  );
};


const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase">
          {property.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 truncate w-4/5">{property.title}</h3>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-bold">{property.rating}</span>
            <span className="text-gray-400 text-xs">({property.reviews})</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1">{property.location}</p>

        {/* Features Row */}
        <div className="flex items-center gap-4 mt-4 py-3 border-b border-gray-300 text-gray-500">
          <div className="flex items-center gap-1 text-[11px]">
            <UserGroupIcon className="h-4 w-4" /> {property.guests} gäster
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <HomeIcon className="h-4 w-4" /> {property.bedrooms} sovrum
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <BeakerIcon className="h-4 w-4" /> {property.bathrooms} badrum
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-l font-black text-gray-900">{property.price} kr</span>
          <span className="text-gray-500 text-sm">/ natt</span>
        </div>
      </div>
    </div>
  );
};
