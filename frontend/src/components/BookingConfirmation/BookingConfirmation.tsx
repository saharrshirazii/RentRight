import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getProperties } from '../../api/propertyApi'
import { Property } from '../../types/property';
import CheckIn from '../Checkin/Checkin'

export default function BookingConfirmation() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        checkIn: initialCheckIn = '',
        checkOut: initialCheckOut = '',
        guestsCount: initialGuestsCount = 1
    } = (location.state as any) || {};

    //Form States
    const [property, setProperty] = useState<Property | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [cancelationAccepted, setCancelationAccepted] = useState(false);

    const [loading, setLoading] = useState(false);


    //fetch individual peroperty profile context
    // useEffect(() => {
    //     const fetchPropertyDetails = async () => {
    //         try {
    //             if (id) {
    //                 const response = await fetch(`http://localhost:3000/api/properties/${id}`);
    //                 const json = await response.json();
    //                 if (json.status === 'success') setProperty(json.data);
    //             }
    //         } catch (error) {
    //             console.error('Kunde inte hämta boendeuppgifter', error);
    //         }
    //     };

    //     fetchPropertyDetails();
    // }, [id]);
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!id) {
                console.error("Error: 'id' is undefined! Check your App.tsx route path variable name.");
                return;
            }

            try {
                const url = `http://localhost:3000/api/v1/properties/${id}`;
                console.log("Fetching from full URL:", url); // 🔍 Debug log 2

                const response = await fetch(url);
                console.log("HTTP Response Status:", response.status); // 🔍 Debug log 3

                const json = await response.json();
                console.log("Raw JSON response body received:", json); // 🔍 Debug log 4

                // Handle both wrapped payloads and raw direct objects safely:
                if (json.status === 'success' && json.data) {
                    setProperty(json.data);
                } else if (json._id || json.id) {
                    // Fallback if your backend sends the property directly without a data wrapper
                    setProperty(json);
                } else {
                    console.warn("Received JSON data structure did not match expected layout keys.");
                }
            } catch (err) {
                console.error("Network fetch operation threw an exception:", err);
            }
        };

        fetchPropertyDetails();
    }, [id]);


    //match Processing calculations
    const start = new Date(initialCheckIn);
    const end = new Date(initialCheckOut);
    const totalNights = property && start < end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const rawBasePrice = property ? totalNights * property.pricePerNight : 0;
    const serviceFee = Math.round(rawBasePrice * 0.10); //10% service charch
    const totalFinalPrice = rawBasePrice + serviceFee;

    //Form submit handler
    const handleConfirmAndPay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termsAccepted || !cancelationAccepted) return alert('Du måste godkänna bokningsvillkoren.');
        setLoading(false);
        try {
            const response = await fetch('http://localhost:3000/api/v1/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Preserves our JWT protection workflow
                },
                body: JSON.stringify({
                    propertyId: id,
                    checkIn: initialCheckIn,
                    checkOut: initialCheckOut,
                    guestsCount: initialGuestsCount,
                    customerDetails: { firstName, lastName, email, phone } // Optional extra info metadata
                })
            });
            const result = await response.json();

            if (response.ok) {
                alert("Bokning bekräftad! Trevlig resa!");
                navigate('/my-bookings'); // Redirects straight to their account records tab
            } else {
                alert(result.message || "Något gick fel vid bokningen.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!property) return <div className="text-center py-20">Laddar bokningsunderlag...</div>;

    return (
        <div>
            {/* Tillbaka */}
            <div className="max-w-7xl mx-auto px-6 pt-4">
                <Link to={`/properties/${id}`} className="text-s text-gray-700 hover:text-indigo-700 flex items-center gap-1 mb-4">
                    ← Tillbaka
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT FORM COLUMN CONTAINER */}
                <form onSubmit={handleConfirmAndPay} className="lg:col-span-2 space-y-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Bekräfta och betala</h1>
                    <p className="text-m text-gray-700 mb-1">Ditt boende är nästan bokad</p>

                    {/* Section 1: Trip Metadata */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl space-y-4 ">
                        <h2 className="text-m font-bold text-gray-900">Din resa</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-700 block mb-1  uppercase">Incheckning</label>
                                <CheckIn
                                    type="text"
                                    value={initialCheckIn}
                                    className="bg-gray-50"

                                />
                                {/* <input type="text" value={initialCheckIn} disabled className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl text-gray-700" /> */}
                            </div>
                            <div>
                                <label className="text-xs text-gray-700 block mb-1 uppercase">Utcheckning</label>
                                <CheckIn
                                    type="text"
                                    value={initialCheckOut}
                                    className="bg-gray-50"
                                />
                                {/* <input type="text" value={initialCheckOut} disabled className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl text-gray-700" /> */}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-700 block mb-1 uppercase">Antal gäster</label>
                            <input type="text" value={`${initialGuestsCount} gäst(er)`} disabled className="w-full bg-gray-50 border border-gray-300 p-2 rounded-xl text-gray-700" />
                        </div>
                        <div>
                            <p>Max 8 gäster</p>
                        </div>
                    </div>

                    {/* Section 2: Personal Details */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold">Vem är det som ska checka in?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-xs text-gray-700 block ">Förnamn
                                <input type="text" placeholder="Sahar" required value={firstName} onChange={e => setFirstName(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                            <label className="text-xs text-gray-700 block">Efternamn
                                <input type="text" placeholder=" Shirazi" required value={lastName} onChange={e => setLastName(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        </div>
                        <label className="text-xs text-gray-700 block ">E-Postadress
                            <input type="email" placeholder="sahar.shirazi@chasacademy.se" required value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        <label className="text-xs text-gray-700 block ">Bekräfta E-Postadres

                            <input type="email" placeholder="sahar.shirazi@chasacademy.se" required value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        <label className="text-xs text-gray-700 block ">Telefonnummer

                            <input type="tel" placeholder="Telefonnummer" required value={phone} onChange={e => setPhone(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                    </div>

                    {/* Section 3: Rules & Agreements */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold">Avbokningsregler</h2>
                        <p className="text-sm text-gray-700 leading-relaxed border-b border-gray-300 pb-4">
                            Gratis avbokning fram till 48 timmar före incheckning. Efter det tillkommer en avgift på 50% av totalpriset.<br />
                            Vid avbokning mellan 48-24 timmar före incheckning får du 50% återbetalning.<br />
                            Vid avbokning senare än 24 timmar före eller efter incheckning sker ingen återbetalning.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed pb-4">
                            fullständiga vilkor gäller enligt hyresvärdens policy.
                            Läs mer här användarvilkor och sekretesspolicy.<br />

                        </p>
                        <label className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 accent-indigo-600" />
                            <span className="text-sm text-indigo-700">Jag godkänner hyresvillkoren, avbokningsreglerna och RentRights användarvillkor.</span>
                        </label>
                        <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={cancelationAccepted} onChange={e => setCancelationAccepted(e.target.checked)} className="mt-1 accent-indigo-600" />
                            <span className="text-sm text-blue-700">Jag godkänner bokningsvillkoren ock avbokningsreglerna</span>
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50">
                        {loading ? 'Slutför bokning...' : 'Bekräfta och boka'}
                    </button>
                </form>

                {/* RIGHT SIDEBAR RECEIPT CARD */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 border border-gray-300 bg-white rounded-2xl shadow-sm overflow-hidden p-6 mt-15 space-y-6">
                        <div className="flex gap-4">
                            <img src={`http://localhost:3000/assets/${property.images?.[0]}`} alt={property.title} className="w-24 h-24 object-cover rounded-xl" />
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{property.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{property.location}</p>
                                <span className="text-xs text-yellow-500 font-semibold">★ {property.rating || '4.5'}</span>
                                <span className="text-xs cursor-pointer">({property.reviewsCount} recensioner)</span>
                            </div>
                        </div>

                        <hr className="border-gray-300" />
                        <div className="flex gap-6 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl w-fit">
                            <span>👥 {property.guests} gäster</span>
                            <span>🛏 {property.bedrooms} sovrum</span>
                            <span>🚿 {property.bathrooms} badrum</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div>
                            <span className='text-sm font-bold'>Incheckning:</span><br/>
                            <span className='text-sm'>{initialCheckIn}</span><br/>
                            <span className='text-sm font-bold'>Utcheckning:</span><br/>
                            <span className='text-sm'>{initialCheckOut}</span>
                        </div>
                        <hr className="border-gray-300" />
                                
                        <h3 className="font-bold text-gray-900 leading-tight">Prisuppdelning</h3>


                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>{property.pricePerNight} kr x {totalNights} nätter</span>
                                <span className="font-medium text-gray-900">{rawBasePrice} kr</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Serviceavgift (10%)</span>
                                <span className="font-medium text-gray-900">{serviceFee} kr</span>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="flex justify-between text-lg font-black text-gray-900">
                            <span>Totalt (SEK)</span>
                            <span>{totalFinalPrice} kr</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}