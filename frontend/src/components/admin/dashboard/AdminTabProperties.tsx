import React, { useState } from 'react';
import { AdminDeleteModal } from '../listings/AdminDeleteModal';
import { Listing } from '../../../types/listingtypes';

interface AdminTabPropertiesProps {
  listings: Listing[];
  onRefresh: () => void;
}

export const AdminTabProperties: React.FC<AdminTabPropertiesProps> = ({ listings, onRefresh }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = "http://localhost:3000";

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSuccess = (id: string) => {
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <span className="text-sm font-bold text-gray-900">🏠 Godkända boenden ({filteredListings.length})</span>
        <input 
          type="text" 
          placeholder="Sök boenden..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
        />
      </div>
      
      {filteredListings.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm">
          {searchTerm ? 'Inga boenden matchar din sökning.' : 'Inga godkända boenden ännu.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Boende</th>
                <th className="p-4">Pris/natt</th>
                <th className="p-4">Status</th>
                <th className="p-4">Skapad</th>
                <th className="p-4 text-center">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredListings.map((listing) => {
                const listingId = listing.id || listing._id || '';
                const mainImage = listing.images?.[0]?.url 
                  ? (listing.images[0].url.startsWith('http') 
                      ? listing.images[0].url 
                      : `${API_BASE_URL}${listing.images[0].url}`)
                  : null;

                return (
                  <tr key={listingId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {mainImage && (
                          <img 
                            src={mainImage} 
                            alt={listing.title} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="text-gray-900 font-bold max-w-[200px] truncate">{listing.title}</div>
                          <div className="text-gray-400 text-[10px]">ID: {listingId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 font-semibold">{listing.price.toLocaleString('sv-SE')} kr</td>
                    <td className="p-4">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        Godkänd
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString('sv-SE')}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setIsDeleteOpen(true);
                        }}
                        className="text-gray-400 hover:text-red-600 mx-1 transition-colors"
                        title="Ta bort boende"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedListing && (
        <AdminDeleteModal
          listing={{
            id: selectedListing.id || selectedListing._id || '',
            title: selectedListing.title,
            location: `Skapad: ${new Date(selectedListing.createdAt).toLocaleDateString('sv-SE')}`,
            price: `${selectedListing.price.toLocaleString('sv-SE')} kr/natt`
          }}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedListing(null);
          }}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};