import React from "react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="bg-green-100 text-green-700 p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          Betalning genomförd!
        </h1>

        <p className="text-lg">
          Din bokning är bekräftad och vi har skickat ett bekräftelsemail.
        </p>
      </div>

      <div className="mt-8 space-x-4">
        <button
          onClick={() => navigate("/my-bookings")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          mina bokningar
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 px-6 py-3 rounded-xl"
        >
          Till startsidan
        </button>
      </div>
    </div>
  );
};