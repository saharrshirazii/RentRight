import React from 'react';
import { useState } from 'react';

interface ToggleProps {
  label: string;
  initialState?: boolean;
  colorTheme?: 'indigo' | 'blue' | 'black';
}

const Toggle = ({ label, initialState = false, colorTheme = 'indigo' }: ToggleProps) => {
  const [enabled, setEnabled] = useState(initialState);

  const getColorClass = () => {
    switch(colorTheme) {
      case 'blue':
        return 'peer-checked:bg-blue-600';
      case 'black':
        return 'peer-checked:bg-black';
      default:
        return 'peer-checked:bg-indigo-600';
    }
  };

  return (
   <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3 select-none">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      {/* Track */}
      <div className={`w-12 h-7 bg-slate-300 rounded-full peer ${getColorClass()} transition-colors duration-200`}></div>
      {/* White Dot */}
      <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>

      <span className="text-sm font-medium">
        {label}
      </span>
    </label>

  )
};

export default Toggle;