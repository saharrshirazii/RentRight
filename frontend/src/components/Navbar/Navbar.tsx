import { useState , useEffect } from 'react';
import Toggle from './../Toggle/Toggle';
import LogIn from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import { IoIosArrowForward } from "react-icons/io";
import { SlBasket } from "react-icons/sl";
import {useNavigate} from 'react-router-dom';

// 1. Lagt till interface för att TypeScript ska förstå setExperience
interface NavbarProps {
  setExperience: (exp: "explore" | "host" | "profile") => void;
  userData?: any;
  setUserData?: (user:any) => void;
}

const Navbar = ({ setExperience, userData, setUserData } : NavbarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  

  

  const closeAuthModal = () => {
    setIsLoginOpen(false);
    setIsLoginView(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // 2. Hjälpfunktion för att navigera till profilens olika flikar
const handleNav = (tab: string) => {
  navigate(`/profile?tab=${tab}`); // Säger till React Router att byta sida på riktigt!
  setIsProfileOpen(false); // Stänger dropdown-menyn
};

  const userStore = localStorage.getItem('user');
  const showUser = userStore ? JSON.parse(userStore) : null;



  //update the count of bookings in basket

  const getToken = localStorage.getItem('token');
  const isLoggedIn = !!getToken;
  useEffect(() => {
  const fetchBookingCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setBookingCount(json.data.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchBookingCount();
}, []);


  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-50 transition-all">
        {/* Logo */}
<a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
  <h1 className={`text-2xl font-bold tracking-tight ${
    showUser?.role === 'host' ? 'text-blue-600' : 
    showUser?.role === 'admin' ? 'text-black' : 
    'text-indigo-600'
  }`}>
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

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8 font-medium text-gray-600">
          <div className="flex flex-wrap items-center justify-center">
            <Toggle 
              label="" 
              initialState={true}
              colorTheme={
                showUser?.role === 'host' ? 'blue' :
                showUser?.role === 'admin' ? 'black' :
                'indigo'
              }
            />
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full hover:border-indigo-500 focus-within:border-indigo-500 transition">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Sök här"
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Cart/Notification Icon */}
          {!showUser || (showUser?.role !== 'host' && showUser?.role !== 'admin') ? (
          <div className="relative cursor-pointer hover:opacity-80 transition">
            <button onClick = {() => navigate('/my-bookings')}>
            <SlBasket size={25} className='text-indigo-500 font-bold'/>
            <span className="absolute -top-2 -right-3 flex items-center justify-center text-[10px] text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
              {bookingCount}
            </span>
            </button>
          </div>
          ) : null}

          {/* Host Navigation Buttons */}
          {showUser?.role === 'host' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
              >
                Utforska
              </button>
              <button 
                onClick={() => navigate('/host')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Mina boenden
              </button>
            </div>
          )}

          {showUser ? (
            <div className="relative">
              {/* Kapseln: Hej + Namn + Profilikon */}
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 border border-gray-300 rounded-full py-1 px-2 hover:shadow-md transition cursor-pointer bg-white"
              >
                {showUser.role === 'admin' && (
                  <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold ml-1">
                    Admin
                  </span>
                )}
                {showUser.role === 'host' && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold ml-1">
                    Host
                  </span>
                )}
                {(showUser.role !== 'admin' && showUser.role !== 'host') && (
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold ml-1">
                    Guest
                  </span>
                )}
                <span className="text-sm font-medium text-gray-700 ml-1">
                  Hej, {showUser.name.split(' ')[0]}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner ${
                  showUser?.role === 'host' ? 'bg-blue-600' : 
                  showUser?.role === 'admin' ? 'bg-black' : 
                  'bg-indigo-600'
                }`}>
                  {showUser.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Dropdown Meny */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-100">
                    {/* 3. Ändrat från <a> till <button> för att undvika sidomladdning */}
                    <button 
                      onClick={() => handleNav('messages')} 
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Meddelanden <span><IoIosArrowForward /></span>
                    </button>
                    <button 
                      onClick={() => handleNav('favorites')} 
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Favoritmarkeringar <span><IoIosArrowForward /></span>
                    </button>
                    <button 
                      onClick={() => handleNav('settings')} 
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Inställningar <span><IoIosArrowForward /></span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      onClick={() => setExperience(showUser.role === 'host' ? 'explore' : 'host')}
                      className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                    >
                      {showUser.role === 'host' ? 'Växla till gästläge' : 'Växla till värdläge'}
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-medium"
                    >
                      Logga ut
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)} 
              className="cursor-pointer px-8 py-2 bg-black hover:bg-gray-800 transition text-white rounded-full font-medium text-sm"
            >
              Logga in
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {isLoginOpen && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-md"
          onClick={() => setIsLoginOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setIsLoginOpen(false)} 
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black font-bold text-xl"
            >
              &times;
            </button>
            <div className="max-h-[90vh] overflow-y-auto p-8">
              {isLoginView ? (
                <LogIn onToggle={() => setIsLoginView(false)} />
              ) : (
                <Register onToggle={() => setIsLoginView(true)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;