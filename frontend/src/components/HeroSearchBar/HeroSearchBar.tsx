import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Checkin from '../Checkin/Checkin'; 
import GuestPicker from '../GuestPicker/GuestPicker';

export const HeroSearchBar: React.FC = () => {
    const navigate = useNavigate();

    // Track search inputs here
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const HandleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload

        //Add validation to prevent back-to-the-future dates!
        if(checkIn && checkOut){
            const start = new Date (checkIn);
            const end = new Date (checkOut);

            if (start >= end){
                alert("Utcheckningsdatum måste vara efter incheckningsdatum!");
                return;   // Stops the navigation from firing entirely
            }
        }

        const params = new URLSearchParams();
        if (location.trim()) params.append('location', location.trim().toLocaleLowerCase());
        if (guests) params.append('guests', guests.toString());
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);

        // Redirect to properties view with parameters appended
        navigate(`/?${params.toString()}`);
    };

    return (
        <form 
            onSubmit={HandleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 lg:p-6 grid grid-cols-1 md:grid-cols-4 items-center gap-4 border border-gray-100"
        >
            {/* Location Input */}
            <div className="px-4 md:border-r border-gray-200 h-full flex flex-col justify-center">
                <p className="text-xs font-bold uppercase text-gray-700 mb-1">Vart</p>
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        placeholder="Var vill du hitta boende?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm placeholder-gray-400 pl-7 py-2 px-2 border border-gray-300 hover:border-indigo-500 hover:bg-gray-50 rounded-lg transition"
                    />
                    <MapPinIcon className="absolute left-1 h-5 w-5 text-gray-500" />
                </div>
            </div>

            {/* Check-in Component */}
            <div className="px-4 md:border-r border-gray-200">
                <Checkin label="Incheckning" value={checkIn} onChange={setCheckIn} />
            </div>

            {/* Check-out Component */}
            <div className="px-4 md:border-r border-gray-200">
                <Checkin label="Utcheckning" value={checkOut} onChange={setCheckOut}/>
            </div>

            {/* Guests & Search Button */}
            <div className="flex items-center justify-between px-4 gap-2">
                <GuestPicker value={guests} onChange={setGuests}/>
                <button
                    type="submit" 
                    className="bg-indigo-600 p-3 rounded-xl text-white hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Sök"
                >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
};