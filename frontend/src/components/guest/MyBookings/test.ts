import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Property } from './../../../types/property'

export const CheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [property, setProperty] = useState<Property | null>(null);




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

    //match Processing calculations
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


    if (!property) return <div>Laddar checkout...</div>;
    if (!checkIn || !checkOut) return <div>Saknar bokningsdata</div>;



    const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/v1/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: id,
          checkIn,
          checkOut,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message); 
      return;
    }

    alert("Betalning genomförd!");
    navigate("/my-bookings");

  } catch (error) {
    console.error("Booking error:", error);
    alert("Något gick fel");
  }
};

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Checkout
                </h1>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        Fastighets-ID:
                    </p>

                    <div className="bg-gray-100 p-4 rounded-lg break-all">
                        {id}
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Betalningsöversikt
                        </h2>

                        <div className="flex justify-between py-2">
                            <span>Bokning</span>
                            <span>{rawBasePrice} kr</span>
                        </div>

                        <div className="flex justify-between py-2">
                            <span>Serviceavgift</span>
                            <span>{serviceFee} kr</span>
                        </div>

                        <div className="flex justify-between py-2 font-bold text-lg border-t mt-2 pt-2">
                            <span>Totalt</span>
                            <span>{totalFinalPrice} kr</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
                    >
                        Bekräfta betalning
                    </button>
                </div>
            </div>
        </div>
    );
};