import React from 'react';

export const AdminTabProperties: React.FC = () => {
  const properties = Array(8).fill({
    title: 'Mysig lägenhet i Södermalm',
    host: 'Anna Andersson',
    location: 'Stockholm, Sverige',
    type: 'Lägenhet',
    price: '1 200 kr',
    rating: '4.8 (42)',
    status: 'Godkänd'
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <span className="text-sm font-bold text-gray-900">🏠 Boenden</span>
        <input 
          type="text" 
          placeholder="Sök boenden..." 
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Boende</th>
              <th className="p-4">Värd</th>
              <th className="p-4">Plats</th>
              <th className="p-4">Typ</th>
              <th className="p-4">Pris/natt</th>
              <th className="p-4">Betyg</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {properties.map((prop, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 text-gray-900 font-bold max-w-[180px] truncate">{prop.title}</td>
                <td className="p-4 text-gray-600">{prop.host}</td>
                <td className="p-4 text-gray-500">{prop.location}</td>
                <td className="p-4 text-gray-500">{prop.type}</td>
                <td className="p-4 text-gray-900 font-semibold">{prop.price}</td>
                <td className="p-4 text-amber-600 font-semibold">{prop.rating}</td>
                <td className="p-4">
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                    {prop.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-gray-400 hover:text-gray-900 mx-1">👁️</button>
                  <button className="text-gray-400 hover:text-red-600 mx-1">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};