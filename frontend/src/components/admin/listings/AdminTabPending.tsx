import React, { useState } from 'react';
import { AdminDeleteModal } from './AdminDeleteModal';
import { AdminReviewModal } from './AdminReviewModal';
import { Listing } from '../../../types/listingtypes';

interface AdminTabPendingProps {
  listings: Listing[];
  onRefresh: () => void;
}

export const AdminTabPending: React.FC<AdminTabPendingProps> = ({ listings, onRefresh }) => {
  // State för borttagnings-modalen
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // State för gransknings-modalen
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  // State för laddningsindikatorer per kort
  const [actionId, setActionId] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  // Hantera granskning via modal
  const handleReview = async (status: 'approved' | 'needs_revision' | 'rejected', feedback: string) => {
    if (!selectedListing) return;
    
    setActionId(selectedListing.id || selectedListing._id || '');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Du måste vara inloggad för att granska annonser.');
      }

      const listingId = selectedListing.id || selectedListing._id || '';
      const response = await fetch(`${API_BASE_URL}/api/v1/listnings/${listingId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, feedback })
      });

      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        throw new Error(data?.message || 'Kunde inte spara granskningen.');
      }
      
      onRefresh(); // Hämtar om listan
    } catch (err) {
      console.error('Review error:', err);
      alert(err instanceof Error ? err.message : 'Ett fel uppstod vid granskning.');
    } finally {
      setActionId(null);
    }
  };

  const openReviewModal = (listing: Listing) => {
    setSelectedListing(listing);
    setIsReviewOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium my-4">
        <span>🕒 Väntande granskningar ({listings.length})</span>
      </div>

      {listings.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
          Inga boenden väntar på granskning just nu. 🎉
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const currentId = item.id || item._id || '';
            const mainImage = item.images && item.images.length > 0 
              ? `${API_BASE_URL}${item.images[0].url}` 
              : null;

            return (
              <div key={currentId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  {/* Bild / Placeholder */}
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    {mainImage ? (
                      <img src={mainImage} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-linear-to-tr from-gray-200 to-gray-300" />
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-xs">
                      {item.price} kr/natt
                    </span>
                  </div>

                  {/* Innehåll */}
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-base line-clamp-1">{item.title}</h4>
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {item.propertyType || 'Lägenhet'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">ID: {currentId}</p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Åtgärdsknappar */}
                <div className="p-4 pt-0 space-y-2">
                  <button
                    onClick={() => openReviewModal(item)}
                    disabled={actionId !== null}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-xl transition disabled:opacity-50"
                  >
                    Granska boende
                  </button>

                  <button
                    onClick={() => {
                      setSelectedListing(item);
                      setIsDeleteOpen(true);
                    }}
                    disabled={actionId !== null}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition"
                  >
                    Ta bort permanent (Logga)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {selectedListing && (
        <AdminDeleteModal
          listing={{
            id: selectedListing.id || selectedListing._id || '',
            title: selectedListing.title,
            location: `System-ID: ${selectedListing.id || selectedListing._id}`,
            price: `${selectedListing.price} kr/natt`
          }}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedListing(null);
          }}
          onDeleteSuccess={() => {
            onRefresh(); // Uppdaterar listan direkt i frontenden
          }}
        />
      )}

      {selectedListing && (
        <AdminReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
          onReview={handleReview}
        />
      )}
    </div>
  );
};