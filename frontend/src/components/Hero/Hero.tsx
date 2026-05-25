import React from 'react';
import heroImage from '../../assets/Hero.jpeg';
import { HeroSearchBar } from '../HeroSearchBar/HeroSearchBar';

interface HeroProps {
    children?: React.ReactNode; 
}

const Hero: React.FC<HeroProps> = ({ children }) => {
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

 {/* Floating Search Bar */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20">
                {children}
            </div>
        </div>
    );
};

export default Hero;