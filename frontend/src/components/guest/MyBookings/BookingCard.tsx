import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { BiShow } from "react-icons/bi";

export interface BookingData {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  propertyId: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    pricePerNight: number;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    category: 'Lägenhet' | 'Villa' | 'Stuga' | 'Radhus' | 'Studio';
  };
}

interface BookingCardProps {
  booking: BookingData;
  onCancel: (id: string) => void;
  onCheckout: (propertyId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onCheckout }) => {
  const navigate = useNavigate();

  if (!booking.propertyId) {
    return <div className="p-4 border rounded-2xl mb-4">Laddar boendeinformation...</div>;
  }

  const { startDate, endDate, totalPrice, status, _id, propertyId: property } = booking;

  const start = new Date(startDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });

  // Safety fallback for formatting asset URLs safely
  const formatImgUrl = (url: any) => {
    if (typeof url !== 'string') {
    return 'https://via.placeholder.com/400';
  }
    return url.startsWith('http') ? url : `http://localhost:3000/assets/${url}`;
  };

  return (
    <div className='flex bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition gap-4 mb-4 relative'>

      {/* Dynamic Category Tag Banner */}
      {property?.category && (
        <span className='absolute top-4 right-4 bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider'>
          {property.category}
        </span>
      )}

      {/* Image display */}
      <div className='w-80 h-full overflow-hidden p-4 shrink-0'>
<img
  // Vi skickar in första bilden om den finns, annars null
  src={formatImgUrl(property?.images && Array.isArray(property.images) ? property.images[0] : null)}
  alt={property?.title || 'Boende bild'}
  className='w-full h-full object-cover rounded-xl'
/>
      </div>

      {/* Description */}
      <div className='flex-1 flex flex-col justify-between py-4 pr-4'>
        <div className='space-y-1'>
          <h3 className='font-bold text-gray-900 text-lg leading-snug'>{property?.title || 'Anonymt boende'}</h3>
          <p className='text-sm text-gray-400 flex items-center gap-1'>{property?.location}</p>
          <p className='text-sm text-gray-700 font-medium pt-1'>
            <span className='font-semibold'>{start}</span> till <span className='font-semibold'>{end}</span>
          </p>

          {/* Micro spec items layout badge bar */}
          <div className="flex gap-4 text-xs text-gray-600 bg-gray-50 p-2 mt-2 rounded-xl w-fit">
            <span>👥 {property?.guests} gäster</span>
            <span>🛏 {property?.bedrooms} sovrum</span>
            <span>🚿 {property?.bathrooms} badrum</span>
          </div>

          {/* Action Row containing Buttons and Total Price at the bottom-right */}
          <div className="flex items-end justify-between pt-6 w-full">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/properties/${property?._id}`)}
                className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"              >
                <BiShow className="text-sm" />
                Visa boende
              </button>

              <button
                onClick={() => navigate(`/properties/${property?._id}/booking`)}
                className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"              >
                <FaEdit className="text-sm" />
                Redigera
              </button>

              {status === 'confirmed' && (
                <button
                  onClick={() => onCancel(_id)}
                  className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"
                ><FaRegTrashAlt className="text-xs" />
                  Avboka resa
                </button>
              )}
            </div>

            {/* Total Price positioned flawlessly on the right edge */}
            <div className="text-right grid grid-cols-1 items-baseline gap-2">
              {booking.paymentStatus === "paid" ? (
                <span className="text-green-600 font-bold">
                  ✓ Betald
                </span>
              ) : (
                <span className="text-orange-500 font-bold">
                  ⚠ Ej betald
                </span>
              )}
              <div>
                <span className="text-sm text-gray-400 font-bold tracking-wider mr-1">Totalpris:</span>
                <span className="text-base font-black text-gray-900">{totalPrice.toLocaleString()} kr</span>
              </div>
              
              {booking.paymentStatus !== "paid" && (
                <div>
                  <button
                    onClick={() =>
                      navigate(`/properties/${property._id}/checkout`, {
                        state: {
                          bookingId: booking._id,
                          checkIn: startDate,
                          checkOut: endDate,
                          guestsCount: property.guests
                        }
                      })
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">
                    Gå till betalning
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};