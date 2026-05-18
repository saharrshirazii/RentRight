
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import PropertyGrid from "./components/PropertyGrid/PropertyGrid";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyDetail } from "./components/PropertyDetail/PropertyDetail"


const App: React.FC = () => {

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Routes>
          <Route path="/" element={<PropertyGrid />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="*" element={<div>Sidan hittades inte (404)</div>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App
