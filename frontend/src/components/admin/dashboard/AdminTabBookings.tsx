import React, { useState, useEffect } from 'react';

interface Booking {
  _id: string;
  propertyId?: { title: string; location?: string };
  userId?: { name: string; email?: string };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'paid' | 'unpaid';
}

export const AdminTabBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/bookings/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          throw new Error('Kunde inte hämta bokningar.');
        }

        const data = await response.json();
        const actualBookings = Array.isArray(data) ? data : data.data || [];
        setBookings(actualBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Bekräftad';
      case 'pending': return 'Väntande';
      case 'cancelled': return 'Avbokad';
      default: return status;
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500">Laddar bokningar...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

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
              <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                <td className="p-4 text-gray-400">#{booking._id.slice(-6)}</td>
                <td className="p-4 text-gray-900 font-bold">{booking.propertyId?.title || 'Okänt boende'}</td>
                <td className="p-4 text-gray-600">{booking.userId?.name || 'Okänd gäst'}</td>
                <td className="p-4 text-gray-500">{formatDate(booking.startDate)}</td>
                <td className="p-4 text-gray-500">{formatDate(booking.endDate)}</td>
                <td className="p-4 text-center">-</td>
                <td className="p-4 text-gray-900 font-semibold">{booking.totalPrice.toLocaleString('sv-SE')} kr</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {getStatusLabel(booking.status)}
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