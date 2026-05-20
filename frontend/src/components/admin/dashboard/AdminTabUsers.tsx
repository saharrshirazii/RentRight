import React from 'react';

export const AdminTabUsers: React.FC = () => {
  const users = Array(8).fill({
    name: 'Anna Andersson',
    email: 'anna@email.se',
    role: 'Värd',
    status: 'Aktiv',
    properties: 3,
    bookings: 24,
    memberSince: '2024-01-15'
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <span className="text-sm font-bold text-gray-900">👥 Användare</span>
        <input 
          type="text" 
          placeholder="Sök användare..." 
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Namn</th>
              <th className="p-4">E-post</th>
              <th className="p-4">Roll</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Boenden</th>
              <th className="p-4 text-center">Bokningar</th>
              <th className="p-4">Medlem sedan</th>
              <th className="p-4 text-center">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 text-gray-900 font-bold">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">{user.role}</span></td>
                <td className="p-4"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">{user.status}</span></td>
                <td className="p-4 text-center">{user.properties}</td>
                <td className="p-4 text-center">{user.bookings}</td>
                <td className="p-4 text-gray-500">{user.memberSince}</td>
                <td className="p-4 text-center">
                  <button className="text-gray-400 hover:text-gray-900 mx-1">👁️</button>
                  <button className="text-gray-400 hover:text-red-600 mx-1">🚫</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};