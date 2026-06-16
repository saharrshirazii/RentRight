import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BeakerIcon, HomeIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Property } from '../../types/property';
import { FilterCategories } from '../FilterCategories/FilterCategories';
import { getApprovedListings } from '../../api/propertyApi';
import FilterSection from '../FilterSection/FilterSection';
import Hero from '../Hero/Hero';
import { HeroSearchBar } from '../HeroSearchBar/HeroSearchBar';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

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
  location: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: ListingImage[];
  propertyType: 'Lägenhet' | 'Radhus' | 'Studio' | 'Stuga' | 'Villa';
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
const queryParams = React.useMemo(() => {
  return new URLSearchParams(search);
}, [search]);
  const checkIn = queryParams.get('checkIn') || "";
const checkOut = queryParams.get('checkOut') || "";
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
// <<<<<<< HEAD
//         const response = await getProperties(page, category, price, searchLocation, searchGuests, checkIn, checkOut);
//         if (response) {
//           setProperties(response.data);
//           setTotalPages(response.pagination?.totalPages || 1);
//           setTotalResults(response.pagination?.totalProperties || 0);
        const approvedListings = await getApprovedListings(category);
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
  // }, [page, category, price, searchLocation, searchGuests , checkIn, checkOut]); 

  }, [category]);

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
              <PropertyCard 
    key={item.id} 
    property={{
      ...item,
      _id: item.id,
      pricePerNight: item.price,
      location: item.location || 'Sverige',
      guests: item.guests ?? 1,
      bedrooms: item.bedrooms ?? 0,
      bathrooms: item.bathrooms ?? 0,
      category: item.propertyType ?? 'Lägenhet',
      images: item.images // SE TILL ATT DENNA RAD FINNS
    } as unknown as Property} 
  />
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




const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = property.images && property.images.length > 0
    ? (typeof property.images[0] === 'string'
      ? property.images[0]
      : (property.images[0] as any).url?.startsWith('http')
        ? (property.images[0] as any).url
        : `http://localhost:3000${(property.images[0] as any).url}`)
    : 'https://via.placeholder.com/400';

    useEffect(() => {
      const checkFavoriteStatus = async () => {

        if (!property || !property._id) return;

        try {
          const token = localStorage.getItem("token");
          if (!token) return; 

          const response = await fetch(`http://localhost:3000/api/v1/favorites/check/${property._id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if(response.ok){
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
        } catch(error){
          console.error("Kunde inte kontroller favoritstatus", error);
        }
        };
        checkFavoriteStatus();
      }, [property?._id]);

      const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");
        if(!token){
          alert("Du måste vara inloggad för att kunna spara favoriter");
          return;
        }
        

        const method = isFavorite? "DELETE" : "POST";
        const url = isFavorite
        ? `http://localhost:3000/api/v1/favorites/${property._id}` 
        : `http://localhost:3000/api/v1/favorites`;

        try{
          const response = await fetch(url, {
            method: method, 
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }, 
            body: !isFavorite ? JSON.stringify({ propertyId: property._id }) : undefined
          });

          if(response.ok){
            setIsFavorite(!isFavorite);
          }
        }catch(error){
          console.error("Nätverksfel vid favoritmarkering", error);
        }
      };

  return (
    <div className="flex flex-col h-full group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <Link to={`/properties/${property._id}`} className='relative h-64 overflow-hidden block'>
        <div className="absolute right-4 top-4 z-20 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg pointer-events-none">
          {property.category}
        </div>
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start">
          <Link to={`/properties/${property._id}`} className="hover:underline block grow max-w-[80%]" >
            <h3 className="font-bold text-gray-900 truncate w-4/5">{property.title}</h3>
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-1">{property.description?.substring(0, 100)}...</p>

        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <span className="truncate">{property.location || 'Sverige'}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <UserGroupIcon className="h-4 w-4 text-gray-400" />
            {property.guests ?? 1} gäster
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <HomeIcon className="h-4 w-4 text-gray-400" />
            {property.bedrooms ?? 0} sovrum
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <BeakerIcon className="h-4 w-4 text-gray-400" />
            {property.bathrooms ?? 0} badrum
          </span>
        </div>

      <div className='mt-4 flex justify-between items-center'>
        <div className="flex items-baseline gap-1">
          <span className="text-l font-black text-gray-900">{property.pricePerNight} kr</span>
          <span className="text-gray-500 text-sm">/ natt</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="p-2 rounded-full border border-gray-100 text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/30 transition-all duration-200 cursor-pointer"
            title={isFavorite ? "Ta bort från sparade" : "Spara boende"}
        >
          {isFavorite ? (
              <HiHeart className="text-xl text-rose-500" />
            ) : (
              <HiOutlineHeart className="text-xl" />
            )}
        </button>
      </div>
    </div>
    </div>
  );
};
