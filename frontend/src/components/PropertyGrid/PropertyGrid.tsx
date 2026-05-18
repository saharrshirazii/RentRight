import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { StarIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon, HomeIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { Property } from '../../types/property';
import { FilterCategories } from '../FilterCategories/FilterCategories';
import { getProperties } from '../../api/propertyApi';
import FilterSection from '../FilterSection/FilterSection';


export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);

  //filter^category
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  //pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //leading
  const [loading, setLoading] = useState(true);

  //total results
  const [totalResults , setTotalResults] = useState(0);

  // const fetchProperties = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getProperties(page, category);

  //     console.log("REALLY RECEIVED:", response);

  //     if (response?.data) {
  //     setProperties(response.data.data);

  //     setTotalPages(
  //       response.data.pagination?.totalPages || 1
  //     );
  //   }
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProperties = async () => {
    setLoading(true);

    try {
      const response = await getProperties(page, category, price);
      if (response) {
        setProperties(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        //count of properties:
      setTotalResults(response.pagination?.totalProperties || 0);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, category, price]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      <FilterSection
        activeSection={category}
        activePrice={price}
        totalResults={totalResults}
        onSectionChange={(newCat) => {
          setCategory(newCat);
          setPage(1);
        }}
        onPriceChange={(newPrice) => {
          setPrice(newPrice);
          setPage(1);
        }}
      />

      <FilterCategories
        activeCategory={category}
        onCategoryChange={(newCat) => {
          setCategory(newCat);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="text-center py-20">Laddar boenden...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((item) => (
              <PropertyCard key={item._id} property={item} />
            ))}
          </div>

          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
            >
              Föregående
            </button>
            <span className="text-sm font-medium">Sida {page} av {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
            >
              Nästa
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          // Handling image array from backend
          src={
            property.images?.[0]
              ? `http://localhost:3000/assets/${property.images[0]}`
              : 'https://via.placeholder.com/400'
          }
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase">
          {property.category}
        </div>
      </div>

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

        {/* Features Row - Updated to use property.featuers */}
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

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-l font-black text-gray-900">{property.pricePerNight} kr</span>
          <span className="text-gray-500 text-sm">/ natt</span>
        </div>
      </div>
    </div>
  );
};