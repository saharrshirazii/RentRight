import React from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Checkin from '../Checkin/Checkin';
import { IoLocationOutline } from "react-icons/io5";
import GuestPicker from '../GuestPicker/GuestPicker';
import heroImage from '../../assets/Hero.jpeg';


const Hero: React.FC = () => {
    return (
        <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px]">

            {/* Background Image & Color Overlays */}
            <div className="absolute inset-0">
                <img
                    src = {heroImage}
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                />
                {/* Purple tint overlay */}
                <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>

            {/* Central Hero Text */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                    Hitta din perfekta <br />
                    <span className="text-white/90">Vistelse var som helst</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
                    Upptäck unika boenden och upplevelser anpassade för varje resa
                </p>

                {/* Scroll Indicator */}
                <div className="absolute bottom-20 left-10 hidden lg:flex flex-col items-center text-white cursor-pointer hover:scale-105 transition">
                    <span className="text-sm font-medium mb-2">Utforska boenden</span>
                    <div className="animate-bounce">↓</div>
                </div>
            </div>

            {/* 3. Floating Search Bar - The "Dashboard" */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-6 grid grid-cols-1 md:grid-cols-4 items-center gap-4 border border-gray-100">

                    {/* Location Input */}
                    <div className="px-4 border-r border-gray-200 h-full flex flex-col justify-center">
                        <p className="text-xs font-bold uppercase text-gray-700 mb-1">Vart</p>
                        <div className="relative flex items-center">

                            <input
                                type="text"
                                placeholder="Var vill du hitta boende?"
                                className="w-full bg-transparent outline-none text-sm placeholder-gray-400 pl-7 py-2 px-2 border border-gray-300 hover:border-indigo-500 hover:bg-gray-50 rounded-lg"
                            />
                            <MapPinIcon className="absolute left-0 h-5 w-5 text-gray-500" />
                        </div>
                    </div>

                    {/* Check-in Component */}
                    <div className="px-4 border-r border-gray-200">
                        <Checkin label="Incheckning" />
                    </div>

                    {/* Check-out Component */}
                    <div className="px-4 border-r border-gray-200">
                        <Checkin label="Utcheckning" />
                    </div>

                    {/* Guests & Search Button */}
                    <div className="flex items-center justify-between px-4">
                        <GuestPicker/>
                        <button
                            className="bg-indigo-600 p-3 rounded-xl text-white hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 mt-4.5"
                            aria-label="Sök"
                        >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;