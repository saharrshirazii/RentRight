import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import { Property } from '../../types/property';
import CheckIn from '../Checkin/Checkin';
import { GiConfirmed } from 'react-icons/gi';

// Hjälpfunktion för att formatera bild-URL från uploaded bilder
const formatImgUrl = (url?: string) => {
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `http://localhost:3000${url}`;
    return `http://localhost:3000/${url}`;
};

export default function BookingConfirmation() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const {
        checkIn: initialCheckIn = '',
        checkOut: initialCheckOut = '',
        guestsCount: initialGuestsCount = 1
    } = (location.state as any) || {};

    // States
    const [property, setProperty] = useState<Property | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [phone, setPhone] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [cancelationAccepted, setCancelationAccepted] = useState(false);
    const [showCancellation, setShowCancellation] = useState(false);
    const [guestsCount, setGuestsCount] = useState(initialGuestsCount);
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Fetch individual property profile context
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!id) {
                console.error("Error: 'id' is undefined! Check your App.tsx route path variable name.");
                return;
            }

            try {
                const url = `http://localhost:3000/api/v1/listnings/${id}`;
                const response = await fetch(url);

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => null);
                    throw new Error(errorBody?.message || `Kunde inte hämta boendet (${response.status}).`);
                }

                const json = await response.json();

                if (json.status === 'success' && json.data) {
                    setProperty(json.data);
                } else if (json._id || json.id) {
                    setProperty(json);
                } else {
                    throw new Error('Ogiltigt svarkort från backend.');
                }
            } catch (err) {
                console.error("Network fetch operation threw an exception:", err);
            }
        };

        fetchPropertyDetails();
    }, [id]);

    // Processing calculations
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const totalNights = property && start < end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const rawBasePrice = property ? totalNights * (property.pricePerNight ?? property.price ?? 0) : 0;
    const serviceFee = Math.round(rawBasePrice * 0.10); // 10% service charge
    const totalFinalPrice = rawBasePrice + serviceFee;

    // Phone validation
    const isValidPhone = (value: string) => {
        return /^\+[1-9]\d{7,14}$/.test(value);
    };

    // Form submit handler
    const handleConfirmAndBook = async (e: React.FormEvent) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        console.log("DEBUG: Försöker boka med ID:", id);
        if (!termsAccepted || !cancelationAccepted) return alert('Du måste godkänna bokningsvillkoren.');
        
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/Login', { state: { from: location.pathname } });
            return;
        }
        if (!isValidPhone(phone)) {
            return alert("Skriv telefonnummer i internationellt format, t.ex. +46701234567");
        }
        if (email.trim() !== emailConfirm.trim()) {
            return alert("E-postadresserna matchar inte.");
        }
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/v1/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    propertyId: id,
                    checkIn,
                    checkOut,
                    guestsCount,
                    customerDetails: {
                        firstName,
                        lastName,
                        email,
                        phone
                    }
                })
            });
            const result = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
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
                <form onSubmit={handleConfirmAndBook} className="lg:col-span-2 space-y-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Bekräfta och betala</h1>
                    <p className="text-m text-gray-700 mb-1">Ditt boende är nästan bokat</p>

                    {/* Trip Metadata */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl space-y-4 ">
                        <h2 className="text-m font-bold text-gray-900">Din resa</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-700 block mb-1 uppercase">Incheckning</label>
                                <CheckIn
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e)}
                                    className="bg-gray-50 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-700 block mb-1 uppercase">Utcheckning</label>
                                <CheckIn
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e)}
                                    className="bg-gray-50 text-xs"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-700 block mb-1 uppercase">Antal gäster</label>
                            <select
                                value={guestsCount}
                                onChange={(e) => setGuestsCount(Number(e.target.value))}
                                className="text-xs w-full border border-gray-300 p-2 rounded-xl"
                            >
                                {Array.from(
                                    { length: property.guests },
                                    (_, i) => i + 1
                                ).map((count) => (
                                    <option key={count} value={count}>
                                        {count} gäst(er)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className='text-xs'>Max 8 gäster</p>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold">Vem är det som ska checka in?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="text-xs text-gray-700 block ">Förnamn
                                <input type="text" placeholder="Ditt namn" required value={firstName} onChange={e => setFirstName(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                            <label className="text-xs text-gray-700 block">Efternamn
                                <input type="text" placeholder=" Ditt efternamn" required value={lastName} onChange={e => setLastName(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        </div>
                        <label className="text-xs text-gray-700 block ">E-Postadress
                            <input type="email" placeholder="namn@exampel.se" required value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        <label className="text-xs text-gray-700 block ">Bekräfta E-Postadress
                            <input type="email" placeholder="namn@exampel.se" required value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)} className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                        <label className="text-xs text-gray-700 block ">Telefonnummer
                            <input type="tel" placeholder="+46 70 123 45 67" required value={phone} onChange={e => {
                                let value = e.target.value;
                                if (value.indexOf('+') !== 0) {
                                    value = '+' + value.replace(/\+/g, '');
                                }
                                setPhone(value.replace(/[^0-9+]/g, ''));
                            }}
                            className="border border-gray-300 p-2 rounded-xl w-full" /></label>
                    </div>

                    {/* Rules & Agreements */}
                    <div className="p-6 bg-white border border-gray-300 rounded-2xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold">Avbokningsregler</h2>
                        <p className="text-sm text-gray-700 leading-relaxed border-b border-gray-300 pb-4">
                            Gratis avbokning fram till 48 timmar före incheckning. Efter det tillkommer en avgift på 50% av totalpriset.<br />
                            Vid avbokning mellan 48-24 timmar före incheckning får du 50% återbetalning.<br />
                            Vid avbokning senare än 24 timmar före eller efter incheckning sker ingen återbetalning.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed pb-4">
                            Fullständiga villkor gäller enligt hyresvärdens policy. Läs mer här under användarvillkor och sekretesspolicy.<br />
                        </p>
                        <label className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 accent-indigo-600" />
                            <span className="text-sm text-indigo-700">Jag godkänner hyresvillkoren, avbokningsreglerna och RentRights användarvillkor. <span> </span>
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(true)}
                                    className="underline text-indigo-600 text-sm"
                                >Läs villkor
                                </button>
                            </span>
                        </label>
                        <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={cancelationAccepted} onChange={e => setCancelationAccepted(e.target.checked)} className="mt-1 accent-indigo-600" />
                            <span className="text-sm text-blue-700">Jag godkänner bokningsvillkoren och avbokningsreglerna. <span> </span>
                                <button
                                    type="button"
                                    onClick={() => setShowCancellation(true)}
                                    className="underline text-blue-600 text-sm"
                                >Läs villkor
                                </button>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50">
                        {loading ? 'Slutför bokning...' : 'Bekräfta och boka'}
                    </button>
                </form>

                {/* RIGHT SIDEBAR RECEIPT CARD */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 border border-gray-300 bg-white rounded-2xl shadow-sm overflow-hidden p-6 mt-15 space-y-6">
                        <div className="flex gap-4">
                            <img src={formatImgUrl(typeof property.images?.[0] === 'string' ? property.images[0] : (property.images[0] as any)?.url)} alt={property.title} className="w-24 h-24 object-cover rounded-xl" />
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
                            <span className='text-sm font-bold'>Incheckning:</span><br />
                            <span className='text-sm'>{checkIn}</span><br />
                            <span className='text-sm font-bold'>Utcheckning:</span><br />
                            <span className='text-sm'>{checkOut}</span>
                        </div>
                        <hr className="border-gray-300" />

                        <h3 className="font-bold text-gray-900 leading-tight">Prisuppdelning</h3>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>{(property.pricePerNight ?? property.price ?? 0)} kr x {totalNights} nätter</span>
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

            {/* Terms and Conditions Popup */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white max-w-lg w-full p-6 rounded-xl max-h-[80vh] overflow-y-auto">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Villkor</h2>
                            <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
                                <p>Genom att genomföra en bokning godkänner du dessa villkor. Dessa villkor gäller mellan gästen och boendevärden.</p>
                                <p><strong>1. Bokning och betalning</strong><br />Bokningen är bindande när den har bekräftats. Full betalning eller reservering krävs enligt vald betalningsmetod.</p>
                                <p><strong>2. Avbokning</strong><br />Avbokning är kostnadsfri fram till 48 timmar före incheckning. Vid avbokning senare än 48 timmar kan avgift tillkomma enligt avbokningsreglerna.</p>
                                <p><strong>3. In- och utcheckning</strong><br />Incheckning sker från angiven tid. Utcheckning ska ske senast angiven tid. Försenad utcheckning kan medföra extra avgift.</p>
                                <p><strong>4. Gästantal</strong><br />Endast antal gäster angivna i bokningen får vistas i boendet. Överträdelse kan leda till avbokning utan återbetalning.</p>
                                <p><strong>5. Skador och ansvar</strong><br />Gästen ansvarar för eventuella skador som uppstår under vistelsen och kan bli ersättningsskyldig.</p>
                                <p><strong>6. Användning av boendet</strong><br />Boendet får endast användas för tillfälligt boende. Olaglig verksamhet är strikt förbjuden.</p>
                                <p><strong>7. Integritet</strong><br />Personuppgifter hanteras enligt gällande dataskyddslagstiftning (GDPR).</p>
                                <p>Dessa villkor kan uppdateras över tid. Det är gästens ansvar att ta del av aktuella villkor före bokning.</p>
                            </div>
                            <button onClick={() => setShowTerms(false)} className="text-xs mt-6 bg-indigo-600 text-white px-4 py-2 rounded-xl">Stäng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancellation Popup */}
            {showCancellation && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white max-w-lg w-full p-6 rounded-xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Avbokningsregler</h2>
                        <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
                            <p>Avbokning är kostnadsfri fram till 48 timmar före incheckning.</p>
                            <p>Vid avbokning mellan 48–24 timmar återbetalas 50% av bokningsbeloppet.</p>
                            <p>Vid avbokning senare än 24 timmar sker ingen återbetalning.</p>
                            <p>Vid utebliven ankomst debiteras hela beloppet.</p>
                        </div>
                        <button onClick={() => setShowCancellation(false)} className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-xl">Stäng</button>
                    </div>
                </div>
            )}

            {/* Success Modal Overlay Component */}
            {showSuccessModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[1000] p-4'>
                    <div className='bg-white rounded-2xl relative max-h-[90vh] overflow-y-auto'>
                        {/* Close Button X */}
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className='absolute top-4 right-4 text-gray-700 hover:text-gray-600 text-xl font-bold transition-colors'
                        >X
                        </button>
                        <div className="p-6 text-center space-y-4">
                            <div className='w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl font-bold border border-green-200 shadow-sm'>✓</div>
                            <h2 className='text-2xl font-black text-gray-700'>Bokning genomförd!</h2>
                            <p className='text-sm text-gray-500 max-w-sm mx-auto'>
                                Din bokning är nu bekräftad. Du får en bekräftelse via e-post inom kort.
                            </p>
                        </div>
                        {/* Image */}
                        <div className='p-4'>
                            <img src={formatImgUrl(typeof property.images?.[0] === 'string' ? property.images[0] : (property.images[0] as any)?.url)} alt={property.title} className="w-full h-40 object-cover rounded-2xl overflow-hidden" />
                        </div>
                        {/* Quick summary preview block */}
                        <div className='p-4 text-left text-xs text-gray-600 space-y-2'>
                            <p className='font-bold text-gray-800 text-sm'>{property.title}</p>
                            <p className='text-gray-800 text-xs'>{property.location}</p>
                            <div className="flex gap-6 text-xs text-gray-700 p-3 w-fit">
                                <span>👥 {property.guests} gäster</span>
                                <span>🛏 {property.bedrooms} sovrum</span>
                                <span>🚿 {property.bathrooms} badrum</span>
                            </div>

                            {/* Checking */}
                            <div className='border-t border-b border-gray-500 p-4'>
                                <div className='grid grid-cols-1 justify-between '>
                                    <span className='text-sm '>Incheckning:</span>
                                    <span className='text-sm text-gray-900 font-bold'>{initialCheckIn}</span>
                                </div>
                                <div className="grid grid-cols-1 justify-between pt-4">
                                    <span className='text-sm '>Utcheckning:</span>
                                    <span className='text-sm text-gray-900 font-bold'>{initialCheckOut}</span>
                                </div>
                                <div className='bg-green-50 border border-green-200 rounded-2xl p-2 mt-4 text-sm text-green-900 font-bold'>{totalNights} nätter bokad.</div>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 text-sm pt-2">
                                <span>Betalat totalt:</span>
                                <span className="text-indigo-600">{totalFinalPrice} kr</span>
                            </div>
                            <div className='bg-indigo-50 border border-indigo-200 rounded-2xl p-2 mt-4 text-sm text-indigo-900 max-w-sm mx-auto'>Ett bekräftelsemejl med alla bokningsdetaljer har skickats till din e-postadress.</div>
                        </div>
                        {/* CTA Navigation Hub button */}
                        <div className='mb-4'>
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="block w-full max-w-sm mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md text-sm cursor-pointer">
                                Gå till mina bokningar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}