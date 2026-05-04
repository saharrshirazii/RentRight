import { useState } from 'react';
import Toggle from './../Toggle/Toggle';

const Navbar = () => {
  // State to handle mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-50 transition-all">
      {/* Logo */}
      <a href="/">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          RentRight
        </h1>
      </a>

      {/* Mobile Menu Toggle Button */}
      <button
        aria-label="Menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="sm:hidden outline-none"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="21" height="1.5" rx=".75" fill="#426287"/>
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287"/>
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287"/>
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      <div className={`${isMenuOpen ? 'flex' : 'hidden'} absolute top-[65px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-8 text-sm md:hidden z-40 border-t border-gray-100`}>
        <a href="#" className="block py-2 text-gray-600 hover:text-indigo-600">Home</a>
        <a href="#" className="block py-2 text-gray-600 hover:text-indigo-600">About</a>
        <a href="#" className="block py-2 text-gray-600 hover:text-indigo-600">Contact</a>
        <button className="w-full cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
          Logga in
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 font-medium text-gray-600">
        {/* <a href="#" className="hover:text-indigo-600 transition">Home</a>
        <a href="#" className="hover:text-indigo-600 transition">About</a>
        <a href="#" className="hover:text-indigo-600 transition">Contact</a>
         */}
         <div className=" flex flex-wrap items-center justify-center ">
      <Toggle label="" initialState={true} />
    </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full hover:border-indigo-500 focus-within:border-indigo-500 transition">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="söka här"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Cart/Notification Icon */}
        <div className="relative cursor-pointer hover:opacity-80 transition">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute -top-2 -right-3 flex items-center justify-center text-[10px] text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            3
          </span>
        </div>

        <button className="cursor-pointer px-8 py-2 bg-black hover:bg-black-600 transition text-white rounded-full">
          Logga  in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
