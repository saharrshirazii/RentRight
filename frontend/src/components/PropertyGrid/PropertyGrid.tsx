import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon, HomeIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { Property } from '../../types/property';
import { FilterCategories } from '../FilterCategories/FilterCategories';
import { getProperties, getApprovedListings } from '../../api/propertyApi';
import FilterSection from '../FilterSection/FilterSection';
import Hero from '../Hero/Hero';
import { HeroSearchBar } from '../HeroSearchBar/HeroSearchBar';

type ListingImage = {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
};

export default function PropertyGrid() {
  const { search } = useLocation(); 
  const [properties, setProperties] = useState<Listing[]>([]);

  // Filter UI states
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Parse URL search parameters safely
  const queryParams = new URLSearchParams(search);
  const searchLocation = queryParams.get('location') || '';
  const searchGuests = queryParams.get('guests') || '';

  // Reset page to 1 whenever a filter or a new query string is processed
  useEffect(() => {
    setPage(1);
  }, [search, category, price]);

  // The fetch wrapper execution block
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const approvedListings = await getApprovedListings();
        if (approvedListings) {
          setProperties(approvedListings);
          setTotalResults(approvedListings.length);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); 

  return (
    <div>
      <Hero>
        <HeroSearchBar />
      </Hero>
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Dynamic Context Messaging */}
        {/* {searchLocation && (
          <p className="text-sm text-gray-500 mb-4">
            Visar resultat för boenden i <span className="font-semibold text-indigo-600">"{searchLocation}"</span> 
            {searchGuests && ` för ${searchGuests} gäster`}
          </p>
        )} */}

        <FilterSection
          activeSection={category}
          activePrice={price}
          totalResults={totalResults}
          onSectionChange={(newCat) => setCategory(newCat)}
          onPriceChange={(newPrice) => setPrice(newPrice)}
        />

        <FilterCategories
          activeCategory={category}
          onCategoryChange={(newCat) => setCategory(newCat)}
        />

        {loading ? (
          <div className="text-center py-20 text-gray-500">Laddar boenden...</div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                Föregående
              </button>
              <span className="text-sm font-medium">Sida {page} av {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
              >
                Nästa
             </button>
            </div>
          </>
        ) : (
          /* Empty Search Results Feedback */
          <div className="text-center py-20 bg-white border rounded-2xl shadow-sm">
            <p className="text-gray-500 font-medium text-lg">Inga fastigheter matchade din sökning.</p>
            <p className="text-gray-400 text-sm mt-1">Testa att ändra din filtrering eller sökort!</p>
          </div>
        )}
      </div>
    </div>
  );
}




const PropertyCard: React.FC<{ property: Listing }> = ({ property }) => {
  const imageUrl = property.images?.[0]
    ? property.images[0].url?.startsWith('http')
      ? property.images[0].url
      : `http://localhost:3000${property.images[0].url}`
    : 'https://via.placeholder.com/400';

  const listingId = property.id;

  return (
    <div className="flex flex-col h-full group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <Link to={`/properties/${listingId}`} className='relative h-64 overflow-hidden block'>
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <Link to={`/properties/${listingId}`} className="hover:underline block flex-grow max-w-[80%]" >
            <h3 className="font-bold text-gray-900 truncate w-4/5">{property.title}</h3>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-1">{property.description?.substring(0, 100)}...</p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-l font-black text-gray-900">{property.price?.toLocaleString('sv-SE')} kr</span>
          <span className="text-gray-500 text-sm">/ natt</span>
        </div>
      </div>
    </div>
  );
};