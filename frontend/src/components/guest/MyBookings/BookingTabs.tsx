import React from 'react'

interface TabProps {
    activeTab: 'upcoming' | 'history';
    setActiveTab : (tab: 'upcoming' | 'history') => void;
}

export const BookingTabs: React.FC<TabProps> = ({activeTab , setActiveTab}) => {
  return (
    <div className="bg-gray-200/70 p-1.5 rounded-xl flex w-full max-w-md mx-auto">
        <button
        onClick = {()=>setActiveTab('upcoming')}
        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-grat-800'
        }`}
        >Komande Bokningar</button>
        <button
        onClick={()=>setActiveTab('history')}
        className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-grat-800'
        }`}
        >Historik</button>

    </div>
  )
}
