import React, { useState, useEffect } from 'react'
import { useParams, Params, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PropertyData } from '../../types/property'
import Checkin from '../Checkin/Checkin'

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
  rating?: number;
  reviewsCount?: number;
  location?: string;
  owner?: {
    name: string;
  };
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  category?: string;
  reviewsList?: any[];
};

type PropertyDisplay = {
  id: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: string[];
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
  rating?: number;
  reviewsCount?: number;
  location?: string;
  owner?: {
    name: string;
  };
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  category?: string;
  reviewsList?: any[];
};

//type for our URL parameters
interface PropertyParams {
  id: string;
};

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<Params & { id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<PropertyDisplay | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //Booking card from statea matching out design
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  //to track the currently displayed large image
  const [activeImage, setActiveImage] = useState<string>('');

  //To read user context dynamically from localStorage
  const loggedInUserStr = localStorage.getItem('user');
  const currentUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : {
      name: "Sahar Shiraz", // Fallback name
      role: "admin"        // Fallback role: 'gäst' | 'värd' | 'admin'
  };

  // Determine whose profile to actually present
  // If a user is logged in, show their info otherwise, fall back to the property owner's info
  const displayName = currentUser?.name || property?.owner?.name || 'Anonym Användare';
  const displayRole = currentUser?.role || property?.owner?.role || 'gäst';

  // Helper function to dynamically style badges based on role types
  const getRoleBadgeClasses = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'värd':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'gäst':
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  //go to the booking page
  const handleProceedToBooking = () => {
    navigate(`/properties/${id}/booking`, {
      state: { checkIn, checkOut, guestsCount }
    });
  }

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/v1/listnings/${id}`);
        if (response.data) {
          const fetchedData = response.data;

          // Check if listing is approved
          if (fetchedData.status !== 'approved') {
            setError('Detta boende är inte tillgängligt för tillfället.');
            return;
          }

          // Convert ListingImage objects to URLs
          const imageUrls = fetchedData.images?.map((img: ListingImage) => 
            img.url?.startsWith('http') ? img.url : `http://localhost:3000${img.url}`
          ) || [];

          // Fallback images array if your database record only has 1 image
          const propertyImages = imageUrls.length >= 5
            ? imageUrls
            : [
              imageUrls[0] || 'https://via.placeholder.com/800x600',
              imageUrls[1] || 'https://via.placeholder.com/800x600',
              imageUrls[2] || 'https://via.placeholder.com/800x600',
              imageUrls[3] || 'https://via.placeholder.com/800x600',
              imageUrls[4] || 'https://via.placeholder.com/800x600',
            ];

          setProperty({
            ...fetchedData,
            images: propertyImages,
            rating: fetchedData.rating || 4.5,
            reviewsCount: fetchedData.reviewsCount || 2,
            location: fetchedData.location || 'Sverige',
            owner: fetchedData.owner || { name: 'Värd' },
            guests: fetchedData.guests || 4,
            bedrooms: fetchedData.bedrooms || 2,
            bathrooms: fetchedData.bathrooms || 1,
            category: fetchedData.category || 'Lägenhet',
            reviewsList: fetchedData.reviewsList || [
              {
                _id: '1',
                author: 'Ulrika Karlsson',
                date: 'Januari 2024',
                rating: 5,
                comment: 'Fantastiskt boende! Rent, modernt och perfekt läge. Värden var otroligt hjälpsam med allt från incheckning till lokala tips.',
                hostReply: 'Tack Ulrika! Du är varmt välkommen tillbaka när som helst.'
              },
              {
                _id: '2',
                author: 'Mikael Nilsson',
                date: 'Oktober 2023',
                rating: 4,
                comment: 'Mycket fint boende med ett bra läge, nära till butiker och restauranger.'
              }
            ]
          });
          // 2. Set the initial active image to the first image in the array
          const firstImg = propertyImages[0];
          setActiveImage(firstImg.startsWith('http') ? firstImg : `http://localhost:3000/assets/${firstImg}`);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Kunde inte hämta boendedetaljer.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();

  }, [id]);

  // Helper function to format image sources safely
  const formatImgUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/400';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-600 font-medium">{error || 'Boendet kunde inte hittas.'}</p>
      </div>
    );
  }


  return (
    <div className="bg-white min-h-screen text-gray-800 antialiased">
      {/* Navbar Placeholder/Spacing */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Link to="/" className="text-s text-gray-700 hover:text-indigo-700 flex items-center gap-1 mb-4">
          ← Tillbaka till sökning
        </Link>

        {/* Main Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.title}</h1>
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <span className="text-yellow-500 font-semibold">★ {property.rating || '4.5'}</span>
          <span>•</span>
          <span className="cursor-pointer">{property.reviewsCount} recensioner</span>
          <span>•</span>
          <span>{property.location}</span>
        </div>

        {/* Carousel / Image Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden shadow-sm aspect-[16/9] md:max-h-[400px] mb-8 w-full">

          {/* Left Side: BIG Main Image*/}
          <div className="md:col-span-2 relative h-full w-full overflow-hidden">
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Right Side: 4 Smaller Images Grid*/}
          <div className="hidden md:grid grid-cols-2 gap-3 w-full content-center">
            {property.images.slice(1, 5).map((imgUrl, index) => {
              const formattedUrl = formatImgUrl(imgUrl);
              const isCurrentlySelected = activeImage === formattedUrl;

              return (
                <button
                  key={index}
                  onClick={() => setActiveImage(formattedUrl)}
                  className="relative w-full w-full aspect-square overflow-hidden cursor-pointer focus:outline-none group rounded-xl"
                >
                  <img
                    src={formattedUrl}
                    alt={`Galleri miniatyr ${index + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isCurrentlySelected ? 'brightness-50 border-2 border-indigo-600' : 'brightness-90'
                      }`}
                  />
                  {/* Visual overlay on hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start pb-20">

          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Host Section */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center font-bold text-rose-700 text-sm">
                {property.owner?.name?.[0] || 'V'}
              </div>
              <div>
                {/* <p className="text-xs text-gray-600">Värd</p> */}
                {/* <h3 className="text-sm font-semibold text-gray-900">{property.owner?.name || 'Anonym Värd'}</h3> */}
                <h3 className="text-sm font-semibold text-gray-900">
  {currentUser?.name || property.owner?.name || 'Anonym Användare'}
</h3>
              </div>
            </div>
            

            {/* Micro Details (Om boendet) */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">Om boendet</h4>
              <div className="flex gap-6 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl w-fit">
                <span>👥 {property.guests} gäster</span>
                <span>🛏 {property.bedrooms} sovrum</span>
                <span>🚿 {property.bathrooms} badrum</span>
              </div>
              <p className="text-xs text-gray-700 mt-4 leading-relaxed">
                Härligt och rymligt boende perfekt för avkoppling. Denna {(property.category || 'Lägenhet').toLowerCase()} erbjuder bra standard, bekväma sängar, och ett fullt utrustat utrymme för en fantastisk vistelse.
              </p>
            </div>

            {/* Amenities Section (Bekvämligheter) */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Bekvämligheter</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {property.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-400">✓</span> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Rendering Engine matching your design card */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1">
                <span className="text-yellow-500">★</span> {property.rating || '4.5'} • {property.reviewsCount} recensioner
              </h4>
              <div className="space-y-4">
                {property.reviewsList?.map((rev) => (
                  <div key={rev._id} className="border border-gray-100 p-4 rounded-xl shadow-2xs bg-gray-50/50">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">{rev.author}</h5>
                        <p className="text-[10px] text-gray-600">{rev.date}</p>
                      </div>
                      <div className="text-yellow-500 text-xs">{'★'.repeat(rev.rating)}</div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                    {/* Host Reply Box (Svar från värden) */}
                    {rev.hostReply && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-200 text-xs text-gray-700 italic">
                        <p className="font-semibold text-[11px] text-gray-700 not-italic mb-0.5">Svar från värden:</p>
                        "{rev.hostReply}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Sticky Booking Widget */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100/50 sticky top-6">
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <span className="text-lg font-bold text-gray-900">{property.price} kr</span>
                <span className="text-gray-600 text-xs"> / natt</span>
              </div>
            </div>

            {/* Input Forms matching UI mockup layout elements */}
            <div className="space-y-2.5 mb-4 text-xs">
              <div>
                {/* <label className="block text-[11px] font-medium text-gray-500 mb-1">Incheckning</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-gray-600" 
                /> */}
                <Checkin
                  label="Incheckning"
                  value={checkIn}
                  onChange={(dateStr) => setCheckIn(dateStr)} />
              </div>
              <div>
                {/* <label className="block text-[11px] font-medium text-gray-500 mb-1">Utcheckning</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-gray-600" 
                /> */}
                <Checkin
                  label="Utcheckning"
                  value={checkOut}
                  onChange={(dateStr) => setCheckOut(dateStr)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Antal gäster</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500 bg-white text-gray-600"
                >
                  {[...Array(property.guests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} gäst{i > 0 ? 'er' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleProceedToBooking} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
              Boka nu
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-2">Du debiteras inte ännu</p>
          </div>

        </div>
      </div>
    </div>
    
  );
}
