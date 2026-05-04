import React , {useState} from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import Dropdown from '../Dropdown/Dropdown';

const categories = [
  { name: 'Alla boenden', icon: null, active: true },
  { name: 'Strand', icon: '🏖️' },
  { name: 'Fjäll', icon: '🏔️' },
  { name: 'Stad', icon: '🏙️' },
  { name: 'Lantligt', icon: '🏡' },
  { name: 'Lyx', icon: '🌟' },
];

const FilterSection: React.FC = () => {
    // Manage the selected state as the whole Option object
    const [typeOption, setTypeOption] = useState({ value: 'all', label: 'Alla typer' });
    const [priceOption, setPriceOption] = useState({ value: 'all', label: 'Alla priser' });

    // Define our options
    const typeOptions = [
        { value: 'all', label: 'Alla typer' },
        { value: 'apartment', label: 'Lägenhet' },
        { value: 'villa', label: 'Villa' },
        { value: 'cottage', label: 'Stuga' }
    ];

    const priceOptions = [
        { value: 'all', label: 'Alla priser' },
        { value: 'low', label: 'Under 1 000 kr' },
        { value: 'mid', label: '1 000 - 2 000 kr' },
        { value: 'high', label: 'Över 2 000 kr' }
    ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 mt-20 mb-4">
        {/* Category Icons Row */}
        <div className="flex items-center gap-8 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat)=>(
                <div 
                key={cat.name}
                className={`flex flex-col items-center gap-2 cursor-pointer border-b-2 pb-2 transition-all ${
              cat.active ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            }`}>
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <span className={`text-xs font-medium whitespace-nowrap ${cat.active ? 'font-bold' : ''}`}>
                    {cat.name}
                </span>
                </div>
            ))}
        </div>
        {/* The Filter Box */}
        <div className="border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
                <FunnelIcon className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">Filtrera resultat</h2>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
          <Dropdown 
                        label={typeOption.label} 
                        options={typeOptions} 
                        onSelect={(opt) => setTypeOption(opt)} 
                    />

                    <Dropdown 
                        label={priceOption.label} 
                        options={priceOptions} 
                        onSelect={(opt) => setPriceOption(opt)} 
                    />
        </div>

        </div>
       {/* Results Title */}
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-gray-900">Populära boenden</h3>
                <p className="text-gray-500 mt-2">6 boenden tillgängliga</p>
            </div>
    </div>
  )
};

// 4. Sub-component for Dropdowns
const FilterDropdown = ({ label, options }: { label: string; options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  return (
    <div className="relative flex-1 md:w-48">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
      >
        <span>{selected}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => { setSelected(opt); setIsOpen(false); }}
              className="px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
