import React from 'react';
import { Listing } from '../../../types/listingtypes';

type HostAvailabilityProps = {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
};

const formatRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${start} – ${end}`;
};

export default function HostAvailability({ listings, onEdit }: HostAvailabilityProps) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tillgänglighetskalender</h2>
        <p className="text-gray-600 max-w-2xl">
          Här ser du vilka datum du har öppet för bokningar per boende. Redigera ett boende för att lägga till eller ändra tillgänglighetsintervaller.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Inga annonser hittades</h3>
          <p className="text-gray-600">Skapa ett boende först och ange därefter tillgänglighet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {listings.map((listing) => {
            const listingId = listing.id || listing._id || 'unknown';
            return (
              <article key={listingId} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        📍 {listing.location || 'Plats ej angiven'}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => onEdit(listing)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      Redigera tillgänglighet
                    </button>
                  </div>

                  {listing.availability && listing.availability.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-gray-700 mb-3">Tillgängliga perioder</div>
                      {listing.availability.map((range, index) => (
                        <div 
                          key={`${listingId}-${index}`} 
                          className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📆</span>
                            <span className="font-medium text-gray-900">{formatRange(range.startDate, range.endDate)}</span>
                          </div>
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Tillgänglig
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-3">⚠️</div>
                      <p className="text-amber-800 font-medium">
                        Ingen tidsperiod har lagts till för detta boende ännu.
                      </p>
                      <p className="text-amber-600 text-sm mt-1">
                        Redigera för att ange tillgänglighet.
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
