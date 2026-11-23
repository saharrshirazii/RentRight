import React, { useState, useEffect } from 'react';
import { AdminTabPending } from '../listings/AdminTabPending';
import { AdminTabUsers } from './AdminTabUsers';
import { AdminTabProperties } from './AdminTabProperties';
import { AdminTabBookings } from './AdminTabBookings';
import { Listing } from '../../../types/listingtypes';


interface AdminDashboardProps {
  setExperience: (exp: "host" | "explore" | "profile" | "admin") => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setExperience }) => {
  const [activeTab, setActiveTab] = useState<string>('pending');


  const [listings, setListings] = useState<Listing[]>([]);
  const [approvedListings, setApprovedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE_URL = "http://localhost:3000";


  const fetchPendingListings = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/listnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Kunde inte hämta boenden');
      const data = await response.json();
      // Filter for pending listings
      const pendingListings = data.filter((listing: Listing) => listing.status === 'pending');
      const approvedListingsData = data.filter((listing: Listing) => listing.status === 'approved');
      setListings(pendingListings);
      setApprovedListings(approvedListingsData);
    } catch (error) {
      console.error("Fel vid hämtning av boenden:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPendingListings();
  }, []);

  const stats = [
  { title: 'Totalt antal användare', value: '1247', subtext: '89 värdar · 1158 gäster' },
  { 
    title: 'Aktiva boenden', 
    value: '6', 
    
    subtext: `${listings.length} väntar godkännande`, 
    trend: 'Aktiva just nu' 
  },
  { title: 'Aktiva boenden', value: '342', subtext: '+18% denna månad' }, 
  { title: 'Total omsättning', value: '4.6M kr', subtext: '+12% denna månad' },
];

  const tabs = [
    { id: 'pending', label: `Väntande (${listings.length})` },
    { id: 'users', label: 'Användare' },
    { id: 'properties', label: `Boenden (${approvedListings.length})` },
    { id: 'bookings', label: 'Bokningar' },
  ];


  const renderTabContent = () => {
    if (loading) return <div className="p-8 text-center text-gray-500">Laddar...</div>;

    switch (activeTab) {
      case 'pending':
        return <AdminTabPending listings={listings} onRefresh={fetchPendingListings} />;
      case 'users': return <AdminTabUsers />;
      case 'properties': return <AdminTabProperties listings={approvedListings} onRefresh={fetchPendingListings} />;
      case 'bookings': return <AdminTabBookings />;
      default:
        return <AdminTabPending listings={listings} onRefresh={fetchPendingListings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* Grid container */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Hantera plattformen och övervaka aktivitet</p>
        </div>

        {/* Övre KPI-rader */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-950 mt-2">{stat.value}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>{stat.subtext}</span>
                {stat.trend && (
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flikar */}
        <div className="flex gap-2 bg-gray-200/60 p-1.5 rounded-xl my-6 max-w-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-950 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamisk Tab-vy */}
        <div className="mt-4">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};