import React , {useEffect , useState} from 'react';
import {StatesSummary} from './StatesSummary';
import { BookingCard , BookingData} from './BookingCard';
import {BookingTabs} from './BookingTabs';
import { useNavigate } from 'react-router-dom';


export const MyBookings: React.FC = () => {
    const [bookings , setBookings] = useState<BookingData[]>([]);
    const [loading , setLoading] = useState(true);
    const [activeTab , setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchBookings = async () => {
    //         try {
    //             const response = await fetch ('http://localhost:3000/api/v1/bookings/my-bookings',{
    //                 headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    //             });
    //             const json = await response.json();
    //             if(response.ok) setBookings(json.data);
    //         }catch(err){
    //             console.error("Kunde inte hämta bokningar:", err);
    //         }finally{
    //             setLoading(false);
    //         }
    //     };
    //     fetchBookings();
    // },[]);

    const fetchBookings = async () => {
    try {
        const response = await fetch(
            'http://localhost:3000/api/v1/bookings/my-bookings',
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        const json = await response.json();

        if (response.ok) {
            setBookings(json.data);
        }
    } catch (err) {
        console.error("Kunde inte hämta bokningar:", err);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchBookings();
}, []);


//handle checkout
const handleCheckout = (propertyId: string) => {
    navigate(`/properties/${propertyId}/checkout`);
};




    if(loading)return <div className='text-center py-20 text-gray-500'>Laddar din bokningar ... </div>;

    const today = new Date();
    const upcomingBookings = bookings.filter(b=>new Date(b.startDate) >= today && b.status !== 'canceled');
    const pastBookings = bookings.filter(b=>new Date(b.startDate) < today || b.status === 'canceled');
    const currentDisplayList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    //Calculation for dashboard grid
    const totalSpent = bookings
    .filter(b=>b.status === 'confirmed')
    .reduce((sum , b)=> sum + b.totalPrice, 0);



    const handleCancelBooking = async (id: string) => {
        if (!window.confirm("Är du säker på att du vill avboka den här resan?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/bookings/${id}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert("Bokningen har avbokats.");
                fetchBookings(); // Cleanly re-fetch data arrays to instantly update layout counters!
            } else {
                const errData = await response.json();
                alert(errData.message || "Det gick inte att avboka resan.");
            }
        } catch (err) {
            console.error("Avbokningsfel:", err);
        }
    };



    
  return (
    <div className='max-w-6xl mx-auto px-4 py-10 space-y-8'>
        <div>
            <h1 className='text-2xl font-bold text-gray-900'>Välkommen tillbaka!</h1>
            <p className='text-sm text-gray-500'>Hantera dina bokningar och profil</p>
        </div>
        {/* Statistics Grid Layout */}
        <StatesSummary
        totalCount = {bookings.length}
        upcomingCount = {upcomingBookings.length}
        pastCount = {pastBookings.length}
        totalSpent = {totalSpent}/>

        {/* Nav switch Toggles */}
        <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

        {/* Loop Rendering Cards */}
        <div className='space-y-4'>
                {currentDisplayList.length > 0 ? (
                    currentDisplayList.map(b => (
                        <BookingCard 
                            key={b._id} 
                            booking={b}
                            onCancel={handleCancelBooking}
                            onCheckout={handleCheckout}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-gray-50 text-sm text-gray-400 font-medium">
                        Inga bokningar hittades i den här listan.
                    </div>
                )}
            </div>
        </div>
    );
};