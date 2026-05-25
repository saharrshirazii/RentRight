import React, { useState } from 'react';
import { AdminTabPending } from '../listings/AdminTabPending';
import { AdminTabUsers } from './AdminTabUsers';
import { AdminTabProperties } from './AdminTabProperties';
import { AdminTabBookings } from './AdminTabBookings';

// 1. Definiera ett interface för props så TypeScript vet att setExperience finns
interface AdminDashboardProps {
  setExperience: (exp: "host" | "explore" | "profile" | "admin") => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setExperience }) => {
  const [activeTab, setActiveTab] = useState<string>('pending');

  const stats = [
    { title: 'Totalt antal användare', value: '1247', subtext: '89 värdar · 1158 gäster' },
    { title: 'Aktiva boenden', value: '6', subtext: '1 väntar godkännande', trend: 'Aktiva just nu' },
    { title: 'Aktiva boenden', value: '342', subtext: '+18% denna månad' },
    { title: 'Total omsättning', value: '4.6M kr', subtext: '+12% denna månad' },
  ];

  const tabs = [
    { id: 'pending', label: 'Väntande (2)' },
    { id: 'users', label: 'Användare' },
    { id: 'properties', label: 'Boenden' },
    { id: 'bookings', label: 'Bokningar' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending': return <AdminTabPending />;
      case 'users': return <AdminTabUsers />;
      case 'properties': return <AdminTabProperties />;
      case 'bookings': return <AdminTabBookings />;
      default: return <AdminTabPending />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Valfritt: Göra så att även loggan tar dig tillbaka till utforska-sidan */}
          <span 
            className="text-xl font-bold text-indigo-600 tracking-wide cursor-pointer"
            onClick={() => setExperience("explore")}
          >
            RentRight
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* 2. Lägg till onClick här för att gå tillbaka till utforska-läget */}
          <button 
            onClick={() => setExperience("explore")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Utforska
          </button>
          <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Admin
          </div>
          <button 
            onClick={() => setExperience("explore")} // Går till utforska vid utloggning i frontend-demot
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Logga ut
          </button>
        </div>
      </header>

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