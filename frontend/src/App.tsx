
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import PropertyGrid from "./components/PropertyGrid/PropertyGrid";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from 'react-router-dom';
import { PropertyDetail } from "./components/PropertyDetail/PropertyDetail"
import BookingConfirmation from './components/BookingConfirmation/BookingConfirmation'
//SAHAR
const App: React.FC = () => {

  return (

    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<PropertyGrid />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/properties/:id/booking" element={<BookingConfirmation />} />
        <Route path="*" element={<div>Sidan hittades inte (404)</div>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App

