import React, { useState } from 'react';
import { PlusIcon, MinusIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

const GuestPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<GuestCounts>({ adults: 2, children: 0, pets: 0 });

  const totalGuests = counts.adults + counts.children;

  const updateCount = (type: keyof GuestCounts, operation: 'add' | 'remove') => {
    setCounts(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  return (
    <div className="relative w-full">
      <p className="text-xs font-bold text-gray-700 mb-2 ml-1">Vem</p>
      
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-gray-200 rounded-lg py-2 px-2 cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all mr-2"
      >
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-gray-700" />
          <span className="text-sm text-gray-700 font-medium">
            {totalGuests} gäster{counts.pets > 0 ? `, ${counts.pets} husdjur` : ''}
          </span>
        </div>
        <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[1000]">
          <GuestRow label="Vuxna" sub="13 år och äldre" value={counts.adults} onAdd={() => updateCount('adults', 'add')} onRemove={() => updateCount('adults', 'remove')} />
          <GuestRow label="Barn" sub="0-12 år" value={counts.children} onAdd={() => updateCount('children', 'add')} onRemove={() => updateCount('children', 'remove')} />
          <GuestRow label="Husdjur" sub="Tar du med ett tjänstedjur?" value={counts.pets} onAdd={() => updateCount('pets', 'add')} onRemove={() => updateCount('pets', 'remove')} />
          
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            Klar
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable row component for the dropdown
const GuestRow = ({ label, sub, value, onAdd, onRemove }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onRemove} className="p-1 rounded-full border border-gray-500 hover:border-indigo-500 text-gray-400 hover:text-indigo-500 transition-colors">
        <MinusIcon className="h-4 w-4 text-gray-500" />
      </button>
      <span className="text-sm font-medium w-4 text-center">{value}</span>
      <button onClick={onAdd} className="p-1 rounded-full border border-gray-500 hover:border-indigo-500 text-gray-400 hover:text-indigo-500 transition-colors">
        <PlusIcon className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  </div>
);

export default GuestPicker;