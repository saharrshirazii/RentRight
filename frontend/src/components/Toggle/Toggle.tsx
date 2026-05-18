import React from 'react';
import { useState } from 'react';

interface ToggleProps {
  label: string;
  initialState?: boolean;
}

const Toggle = ({ label, initialState = false }: ToggleProps) => {
  const [enabled, setEnabled] = useState(initialState);

  return (
   <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3 select-none">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      {/* Track */}
      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200"></div>
      {/* White Dot */}
      <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>

      <span className="text-sm font-medium">
        {label}
      </span>
    </label>

  )
};

export default Toggle;