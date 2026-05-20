import React, { useState } from 'react';
import { AdminReviewModal } from './AdminReviewModal';

export const AdminTabPending: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingItems = [
    { id: '1', title: 'Mysig lägenhet i Södermalm', location: 'Stockholm, Sverige', price: '3500 kr' },
    { id: '2', title: 'Modern etta nära city', location: 'Göteborg, Sverige', price: '2800 kr' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium my-4">
        <span>🕒 Väntande granskningar</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-44 bg-gradient-to-tr from-gray-200 to-gray-300 relative">
              <span className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold text-gray-900">
                {item.price}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.location}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  Ljus och trevlig lägenhet redo för granskning...
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition"
              >
                Granska boende
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};