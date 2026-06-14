import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Property } from './../../../types/property';

export const CheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [property, setProperty] = useState<Property | null>(null);
    const bookingId = (location.state as any)?.bookingId;

    const {
        checkIn = "",
        checkOut = "",
        guestsCount = 1
    } = (location.state as any) || {};

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/properties/${id}`)
            .then(res => res.json())
            .then(data => setProperty(data.data)); 
    }, [id]);

    // Match Processing calculations
    const start = checkIn ? new Date(checkIn) : null;
    const end = checkOut ? new Date(checkOut) : null;
    const totalNights =
        start && end && end > start
            ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
    const rawBasePrice =
        property && totalNights > 0
            ? totalNights * property.pricePerNight
            : 0;

    const serviceFee =
        rawBasePrice > 0
            ? Math.round(rawBasePrice * 0.1)
            : 0;

    const totalFinalPrice = rawBasePrice + serviceFee;

    if (!property) return <div className="p-6 text-center text-gray-500">Laddar checkout...</div>;
    if (!checkIn || !checkOut) return <div className="p-6 text-center text-red-500">Saknar bokningsdata</div>;

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/v1/bookings/${bookingId}/pay`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Något gick fel vid betalningen");
            }

            navigate("/payment-success");

        } catch (error) {
            console.error("Payment error:", error);
            alert(error instanceof Error ? error.message : "Betalningen misslyckades");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Checkout
                </h1>

                <div className="space-y-4">
                    <p className="text-gray-600 font-medium">
                        Boende: <span className="text-gray-900 font-bold">{property.title}</span>
                    </p>

                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-1 text-sm text-gray-600">
                        <div><span className="font-semibold">Datum:</span> {checkIn} till {checkOut} ({totalNights} nätter)</div>
                        <div><span className="font-semibold">Antal gäster:</span> {guestsCount} st</div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Betalningsöversikt
                        </h2>

                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Bokningspris ({totalNights} nätter)</span>
                            <span>{rawBasePrice.toLocaleString()} kr</span>
                        </div>

                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Serviceavgift (10%)</span>
                            <span>{serviceFee.toLocaleString()} kr</span>
                        </div>

                        <div className="flex justify-between py-2 font-black text-xl border-t mt-2 pt-2 text-gray-900">
                            <span>Totalt att betala</span>
                            <span>{totalFinalPrice.toLocaleString()} kr</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-sm mt-4"
                    >
                        Bekräfta betalning
                    </button>
                </div>
            </div>
        </div>
    );
};