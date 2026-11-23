import React from 'react'

interface FilterCategoryProps {
    activeCategory: string;  //The currently selected category
    onCategoryChange: (category: string) => void;
}

export const FilterCategories: React.FC<FilterCategoryProps> = ({ activeCategory, onCategoryChange }) => {
    const categories = [
        {label: 'All' , value: ''},
        {label: 'Stuga' , value: 'Stuga'},
        {label: 'Lägenhet' , value: 'Lägenhet'},
        {label: 'Radhus' , value: 'Radhus'},
        {label: 'Villa' , value: 'Villa'},
        {label: 'Studio' , value: 'Studio'}
    ];
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', padding: '10px 0' }}>
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onCategoryChange(cat.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            border: '1px solid #ddd',
            // 3. Highlight the active button
            backgroundColor: activeCategory === cat.value ? '#4F39F6' : '#fff',
            color: activeCategory === cat.value ? '#fff' : '#000',
            transition: 'all 0.3s ease'
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}