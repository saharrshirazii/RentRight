import React from 'react';

interface AdminReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-950">Granska boende</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-semibold">&times;</button>
        </div>

        {/* Innehåll */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-gray-500">
            Fatta beslut om detta boende ska godkännas, nekas eller behöver komplettering.
          </p>

          {/* Bildkarusell Placeholder */}
          <div className="relative h-48 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
            <span className="text-xs text-gray-400">Bildkarusell från Figma</span>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full text-xs shadow">&lsaquo;</button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full text-xs shadow">&rsaquo;</button>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-base">Mysig lägenhet i ...</h4>
            <p className="text-xs text-gray-400 mt-0.5">Ljus och rymlig lägenhet i hjärtat av...</p>
          </div>

          {/* Info-Grid */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl text-xs">
            <div><span className="text-gray-400">Värd:</span> <p className="font-medium">Anna Andersson</p></div>
            <div><span className="text-gray-400">Plats:</span> <p className="font-medium">Stockholm, Sverige</p></div>
            <div><span className="text-gray-400">Pris/natt:</span> <p className="font-medium">1 200 kr</p></div>
            <div><span className="text-gray-400">Boendetyp:</span> <p className="font-medium">Lägenhet</p></div>
          </div>

          {/* Beslutsval */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">Beslut</label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="decision" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs font-medium text-gray-800">Godkänn (Publicera direkt)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="decision" className="text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs font-medium text-gray-800">Begär komplettering</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="decision" className="text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs font-medium text-gray-800">Neka (Skicka meddelande)</span>
            </label>
          </div>

          {/* Textruta för feedback */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Meddelande till användaren (obligatoriskt)</label>
            <textarea 
              rows={3} 
              placeholder="Skriv anledning till beslut..." 
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100">
            Avbryt
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-semibold text-white">
            Spara granskning
          </button>
        </div>

      </div>
    </div>
  );
};