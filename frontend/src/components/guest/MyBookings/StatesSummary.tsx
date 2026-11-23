import React from 'react';

interface StateProps {
  totalCount : number;
  upcomingCount: number;
  pastCount: number;
  totalSpent: number;
}

export const StatesSummary:React.FC<StateProps> = ({totalCount, upcomingCount, pastCount, totalSpent}) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <div className='p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:bg-gray-100'>
        <p className="text-xs font-semibold text-gray-400 uppercase">Bokningar</p>
        <p className="text-3xl font-bold mt-2 text-gray-900">{totalCount}</p>
      </div>
      <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:bg-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase">Kommande</p>
                <p className="text-3xl font-bold mt-2 text-gray-800">{upcomingCount}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:bg-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase">Genomförda</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{pastCount}</p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs hover:bg-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase">Totalt spenderat</p>
                <p className="text-2xl font-black mt-2 text-gray-900">{totalSpent.toLocaleString('sv-SE')} kr</p>
            </div>

    </div>
  )
}
