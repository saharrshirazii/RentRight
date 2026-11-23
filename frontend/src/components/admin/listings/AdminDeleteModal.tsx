import React, { useState } from 'react';


interface MockListing {
  id: string;
  title: string;
  location: string;
  price: string;
}

interface AdminDeleteModalProps {
  listing: MockListing;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: (id: string) => void;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  listing,
  isOpen,
  onClose,
  onDeleteSuccess
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Du måste ange en anledning för att kunna ta bort listningen.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // Hämtar JWT-token
      const response = await fetch(`http://localhost:3000/api/v1/listnings/${listing.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: reason.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Kunde inte ta bort annonsen.');
      }

      onDeleteSuccess(listing.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod vid kommunikation med servern.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-bold text-gray-900">Ta bort olämpligt boende</h3>
        <p className="text-xs text-gray-500 mt-1">
          Denna åtgärd kommer att radera annonsen permanent och loggas i systemet.
        </p>

        {/* Förhandsvisning av objektet som tas bort */}
        <div className="my-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <h4 className="text-sm font-semibold text-red-950">{listing.title}</h4>
          <p className="text-xs text-red-800/80 mt-0.5">{listing.location}</p>
          <span className="inline-block mt-2 text-xs font-bold bg-red-200/60 text-red-900 px-2 py-0.5 rounded-md">
            {listing.price}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="delete-reason" className="block text-xs font-semibold text-gray-700 mb-1">
              Anledning till borttagning <span className="text-red-500">*</span>
            </label>
            <textarea
              id="delete-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ange varför annonsen tas bort (t.ex. Olämpliga bilder, felaktig prisinformation...)"
              className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none placeholder:text-gray-400"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
              ⚠️ {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition border border-gray-200"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-50"
            >
              {isSubmitting ? 'Tar bort...' : 'Bekräfta borttagning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};