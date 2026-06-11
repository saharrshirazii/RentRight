import React, { useState, useEffect } from 'react';
import { HiUser, HiMail, HiHeart, HiLockClosed, HiLogout, HiSwitchHorizontal, HiOutlineHeart } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import ProfilePropertyCard from '../../components/ProfilePropertyCard/ProfilePropertyCard';

interface ProfilePageProps {
  setExperience: (exp: "explore" | "host" | "profile") => void;
  userData: any;
  setUserData: any;
}

const ProfilePage = ({ setExperience, userData, setUserData }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('messages');
  
  // States för lösenordsbytet
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  //States och useEffect för meddelanden
  const [conversations, setConversations] = useState<any[]>([]);
  const [messageLoading, setMessageLoading] = useState(true);

  //States för favoritmarkeringar
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  //UseEffect och fetch för meddelanden
  useEffect(()=>{
    const fetchInbox = async () => {
      try{
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/v1/messages/inbox", {
          headers: {"Authorization": `Bearer ${token}`}
        });

        if(response.ok){
          const resData = await response.json();
          setConversations(resData.data || []);
        }
      }catch(error){
        console.error("Fel vid hämtning av meddelanden", error);
      }
      finally{
        setMessageLoading(false);
      }
    };
    fetchInbox();
  }, []);

  //UseEffect och fetch för favoritmarkeringar
useEffect(() => {
    const fetchFavorites = async () => {
      setFavoritesLoading(true); // Sätt loading till true när vi börjar hämta
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:3000/api/v1/favorites", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const resData = await response.json();
          console.log("HÄMTAD DATA FRÅN BACKEND:", resData);
          // Här sparar vi datan
          setFavorites(resData.data || resData || []);
        }
      } catch (error) {
        // Vi behåller bara error-loggen för felsökning vid riktiga fel
        console.error("Fel vid hämtning av favoriter", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    // Kör hämtning direkt
    fetchFavorites();

    // Lyssnare som uppdaterar listan när användaren går tillbaka till fönstret
    window.addEventListener('focus', fetchFavorites);
    
    // Städning
    return () => window.removeEventListener('focus', fetchFavorites);
  }, []);

  //Ta bort favorit från profilsidan
  const handleRemoveFavorite = async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try{
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/v1/favorites/${propertyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        // Ta bort boendet från vårt lokala state direkt så att det försvinner från skärmen snyggt
        setFavorites(prev => prev.filter(item => item._id !== propertyId));
      }
  }catch(error){
    console.error("Kunde inte ta bort favorit", error)
  }
  };


  // Byta roll (Host / Guest) 
const handleSwitchRole = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    
    const response = await fetch("http://localhost:3000/api/v1/auth/switch-role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json(); 
    
    console.log("Data från servern vid rollbyte:", data);

    if (!response.ok) return;

    // 1. Spara den nya tokenen i localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // 2. Spara användardatan (hanterar både om du skickar tillbaka objektet direkt eller i en 'user'-property)
    const userToSave = data.user || data;
    localStorage.setItem("user", JSON.stringify(userToSave));
    
    // 3. Uppdatera React-statet så att UI:t uppdateras direkt
    setUserData(userToSave); 
  };

  // Skicka nytt lösenord till backend
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'De nya lösenorden matchar inte.' });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordStatus({ type: 'error', message: data.message || 'Kunde inte byta lösenord.' });
        return;
      }

      setPasswordStatus({ type: 'success', message: 'Lösenordet har ändrats!' });
      
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
        setPasswordStatus(null);
      }, 2000);

    } catch (error) {
      console.error(error);
      setPasswordStatus({ type: 'error', message: 'Ett oväntat fel inträffade.' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = window.innerWidth < 768 ? 80 : 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -40% 0px',
      threshold: [0, 0.5]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['messages', 'favorites', 'settings', 'security'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isBottom) setActiveSection('security');
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setTimeout(() => scrollToSection(tab), 150);
  }, []);

  const menuItems = [
    { id: 'messages', label: 'Meddelanden', icon: <HiMail className="text-xl" /> },
    { id: 'favorites', label: 'Favoriter', icon: <HiHeart className="text-xl" /> },
    { id: 'settings', label: 'Inställningar', icon: <HiUser className="text-xl" /> },
    { id: 'security', label: 'Säkerhet', icon: <HiLockClosed className="text-xl" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      

      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pt-10 md:pt-16 pb-6 md:pb-10 border-b border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Profil</h2>
        <div className="flex items-center gap-3 mt-3">
          <p className="text-lg md:text-xl text-gray-600 font-medium">{userData?.name || 'Användare'}</p>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
            {userData?.role || 'guest'}
          </span>
        </div>
      </header>

      {/* --- MOBIL MENY --- */}
      <div className="md:hidden sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex px-6 py-4 gap-6 min-w-max">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-bold transition-all relative ${
                activeSection === item.id ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <div className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex flex-col md:flex-row gap-10 md:gap-20 mt-10 md:mt-16">
        
        {/* --- DESKTOP MENY --- */}
        <aside className="hidden md:block w-72">
          <nav className="sticky top-32 space-y-10">
            <ul className="space-y-6">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-4 text-lg transition-all duration-300 relative py-1 group ${
                      activeSection === item.id ? 'text-indigo-600 font-semibold' : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <div className={`absolute -bottom-2 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                      activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-1/2'
                    }`} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-10 border-t border-gray-100 space-y-5 text-gray-500">
              <button onClick={handleSwitchRole} className="flex items-center gap-4 hover:text-indigo-600 transition-colors w-full text-left">
                <HiSwitchHorizontal className="text-xl" />
                <span className="text-sm font-medium">Växla läge</span>
              </button>
              
<button 
  onClick={() => { 
    // 1. Tömmer webbläsarens minne på token och user-data
    localStorage.clear(); 
    
    // 2. Nollställer statet i App.tsx så navbaren fattar att du är utloggad
    setUserData(null);    
    
    // 3. Skickar dig till startsidan
    window.location.href = '/'; 
  }} 
  className="flex items-center gap-4 hover:text-red-600 transition-colors w-full text-left"
>
  <HiLogout className="text-xl" />
  <span className="text-sm font-medium">Logga ut</span>
</button>
            </div>
          </nav>
        </aside>

        {/* --- INNEHÅLL --- */}
        <main className="flex-1 space-y-20 md:space-y-32 pb-40">
          <section id="messages" className="scroll-mt-40 md:scroll-mt-32">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Meddelanden</h3>
            
            {messageLoading ? (
              <p className="text-sm text-gray-400 animate-pulse">Laddar konversationer...</p>
            ) : conversations.length === 0 ? (
              <div className="py-12 md:aspect-[16/5] border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-gray-400">
                <HiMail className="text-4xl mb-2 opacity-20" />
                <p className="text-sm">Inga meddelanden</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((chat) => (
                  <div 
                    key={chat.user} 
                    className="p-6 border border-gray-100 rounded-[1.5rem] hover:shadow-lg transition-all flex justify-between items-center bg-white cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Konversation (ID: {chat.user.substring(0, 6)}...)</p>
                      <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      {new Date(chat.date).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

<section id="favorites" className="scroll-mt-40 md:scroll-mt-32">
  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Favoritmarkeringar</h3>
  
  {favoritesLoading ? (
    <p className="text-sm text-gray-400 animate-pulse">Laddar dina sparade boenden...</p>
  ) : favorites.length === 0 ? (
    <div className="h-48 md:h-64 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
      Inga sparade objekt
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((property) => (
        <ProfilePropertyCard 
          key={property._id} 
          property={property} 
          onRemove={handleRemoveFavorite} 
          
        />
      ))}
    </div>
  )}
</section>

          <section id="settings" className="scroll-mt-40 md:scroll-mt-32">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Inställningar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[ {label: 'Namn', val: userData?.name || 'Användare'}, {label: 'E-post', val: userData?.email || 'Ingen e-post'} ].map((box, i) => (
                <div key={i} className="p-6 md:p-8 border border-gray-100 rounded-[1.5rem] hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{box.label}</p>
                      <p className="text-gray-900 font-semibold text-base md:text-lg">{box.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="security" className="scroll-mt-40 md:scroll-mt-32">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Säkerhet</h3>
            <div className="p-8 md:p-10 bg-indigo-600 rounded-[2rem] text-white shadow-lg shadow-indigo-100 transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                 <div>
                   <h4 className="font-bold text-lg md:text-xl mb-1">Ditt konto är säkert</h4>
                   <p className="text-indigo-100 text-xs md:text-sm opacity-90">Skydda ditt konto med ett starkt lösenord.</p>
                 </div>
                 <button 
                   onClick={() => setShowPasswordForm(!showPasswordForm)} 
                   className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                 >
                   {showPasswordForm ? 'Avbryt' : 'Byt lösenord'}
                 </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="mt-8 pt-8 border-t border-indigo-500/40 space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">Nuvarande lösenord</label>
                    <input 
                      type="password" 
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-500 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:border-white transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">Nytt lösenord</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-500 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:border-white transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">Bekräfta nytt lösenord</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-500 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:border-white transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {passwordStatus && (
                    <div className={`p-4 rounded-xl text-sm font-semibold ${
                      passwordStatus.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {passwordStatus.message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-indigo-900 text-white font-bold rounded-xl hover:bg-indigo-950 transition-colors shadow-inner"
                  >
                    Spara nytt lösenord
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;