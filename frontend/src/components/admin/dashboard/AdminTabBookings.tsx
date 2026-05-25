import React from 'react';

export const AdminTabBookings: React.FC = () => {
  const bookings = [
    { id: '87', property: 'Mysig lägenhet i Södermalm', guest: 'David Svensson', checkIn: '2026-06-10', checkOut: '2026-06-15', guests: 2, totalPrice: '6 000 kr', status: 'Kommande' },
    { id: '86', property: 'Fjällstuga i Åre', guest: 'Maria Karlsson', checkIn: '2026-05-12', checkOut: '2026-05-19', guests: 4, totalPrice: '10 500 kr', status: 'Genomförd' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <span className="text-sm font-bold text-gray-900">📅 Alla bokningar</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Boknings-ID</th>
              <th className="p-4">Boende</th>
              <th className="p-4">Gäst</th>
              <th className="p-4">Incheckning</th>
              <th className="p-4">Utcheckning</th>
              <th className="p-4 text-center">Gäster</th>
              <th className="p-4">Totalt</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 text-gray-400">#{booking.id}</td>
                <td className="p-4 text-gray-900 font-bold">{booking.property}</td>
                <td className="p-4 text-gray-600">{booking.guest}</td>
                <td className="p-4 text-gray-500">{booking.checkIn}</td>
                <td className="p-4 text-gray-500">{booking.checkOut}</td>
                <td className="p-4 text-center">{booking.guests}</td>
                <td className="p-4 text-gray-900 font-semibold">{booking.totalPrice}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                    booking.status === 'Genomförd' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};