import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom'; 

// Befintliga komponenter för gästflödet
import Navbar from "./components/Navbar/Navbar";
import PropertyGrid from "./components/PropertyGrid/PropertyGrid";
import Footer from "./components/Footer/Footer";

import BookingConfirmation from './components/BookingConfirmation/BookingConfirmation'
import { MyBookings } from "./components/guest/MyBookings/MyBookings";
import { CheckoutPage } from "./components/guest/MyBookings/CheckoutPage";
import Login from "./pages/auth/Login"
import { PropertyDetail } from "./components/PropertyDetail/PropertyDetail";

import ProfilePage from "./pages/profile/ProfilePage";

// VÄRD-KOMPONENTER
import ListingForm from "./components/Host/listings/ListingForm";
import ListingPreviewModal from "./components/Host/listings/ListingPreviewModal";
import ListingsView from "./components/Host/listings/ListingsView";
import HostBookings from "./components/Host/bookings/HostBookings";
import HostDashboard from "./components/Host/dashboard/HostDashboard";
import { HostMessages } from "./components/Host/messages/HostMessages";

// Admin & Typer
import { Listing, TabId } from "./types/listingtypes";
import { AdminDashboard } from "./components/admin/dashboard/AdminDashboard";

const API_BASE_URL = "http://localhost:3000";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "boende", label: "Boende" },
  { id: "bokningar", label: "Bokningar" },
  { id: "meddelanden", label: "Meddelanden" },
  { id: "tillganglighet", label: "Tillgänglighet" },
  { id: "prissattning", label: "Prissättning" },
  { id: "recensioner", label: "Recensioner" },
  { id: "statistik", label: "Statistik" },
];

const stats = [
  { title: "Totalt intjäning", value: "127 500 kr", meta: "+12% sedan förra månaden", tone: "green" },
  { title: "Antal bokningar", value: "24", meta: "+3 nya denna månad", tone: "blue" },
  { title: "Genomsnittligt betyg", value: "4.8", meta: "Baserat på 83 recensioner", tone: "orange" },
  { title: "Beläggningsgrad", value: "78%", meta: "+5% sedan förra månaden", tone: "cyan" },
];

const App: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>("boende");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingError, setListingError] = useState("");
  const [deletingListingId, setDeletingListingId] = useState("");

  const [userData, setUserData] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const hasOpenModal = isCreateOpen || Boolean(editingListing) || Boolean(viewingListing);

  // Hämta annonser från backend
  const fetchListings = async () => {
    setIsLoadingListings(true);
    setListingError("");
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/v1/listnings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Kunde inte hämta annonser.");
      }
      const data = (await response.json()) as any[];
      
      
      const normalizedData = data.map(item => ({
        ...item,
        id: item.id || item._id
      }));

      setListings(normalizedData);
    } catch {
      setListingError("Kunde inte ladda boenden. Kontrollera din anslutning.");
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    void fetchListings();
  }, []);

  // När ett nytt boende har skapats
  const handleListingCreated = (newListing: any) => {
    if (!newListing || typeof newListing !== 'object') {
      void fetchListings();
      return;
    }

    const normalized = {
      ...newListing,
      id: newListing.id || newListing._id
    };

    setListings((currentListings) => [normalized, ...currentListings]);
    setIsCreateOpen(false);
    setActiveTab("boende");
  };

  // När ett boende har blivit uppdaterat
  const handleListingUpdated = (updatedListing: any) => {
    if (!updatedListing || typeof updatedListing !== 'object') {
      void fetchListings();
      return;
    }

    const normalized = {
      ...updatedListing,
      id: updatedListing.id || updatedListing._id
    };

    setListings((currentListings) =>
      currentListings.map((listing) =>
        (listing.id === normalized.id || (listing as any)._id === normalized.id) ? normalized : listing
      )
    );
    setEditingListing(null);
  };

 
  const handleDeleteListing = async (listingId: string) => {
    if (!listingId) return;
    
    setDeletingListingId(listingId);
    setListingError("");
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/v1/listnings/${listingId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Kunde inte ta bort annonsen.");
      }

      
      setListings((currentListings) =>
        currentListings.filter((listing: any) => {
          const currentId = listing.id || listing._id;
          return currentId !== listingId;
        })
      );

      
      setTimeout(() => {
        void fetchListings();
      }, 200);

    } catch (deleteError) {
      console.error("Fel vid radering:", deleteError);
      setListingError(deleteError instanceof Error ? deleteError.message : "Något gick fel.");
      void fetchListings(); 
    } finally {
      setDeletingListingId("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar userData={userData} setUserData={setUserData} setExperience={() => {}} />
      
      <Routes>
        {/* STARTSIDA */}
        <Route 
          path="/" 
          element={
            <main>
              <PropertyGrid />
            </main>
          } 
        />

        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/properties/:id/booking" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/properties/:id/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<Login/>}/>

        
        
        <Route 
          path="/profile" 
          element={
            <ProfilePage 
              setExperience={() => {}} 
              userData={userData} 
              setUserData={setUserData} 
            />
          } 
        />

        <Route path="/admin" element={<AdminDashboard setExperience={(exp) => navigate(`/${exp}`)} />} />
        
        {/* VÄRD-SIDA (HOST SHELL) */}
        <Route 
          path="/host" 
          element={
            <main className="host-shell">
              <section className={hasOpenModal ? "host-frame is-blurred" : "host-frame"}>
                
                <HostDashboard stats={stats} />

                <section className="page-header" style={{ padding: '0 20px', marginBottom: '24px' }}>
                  <button type="button" className="primary-button" onClick={() => setIsCreateOpen(true)}>
                    + Lägg till boende
                  </button>
                </section>

                <section className="tabs-panel" aria-label="Host sections">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={tab.id === activeTab ? "tab-button is-active" : "tab-button"}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </section>

                <section className="content-panel">
                  {activeTab === "boende" && (
                    <ListingsView
                      deletingListingId={deletingListingId}
                      error={listingError}
                      isLoading={isLoadingListings}
                      listings={listings}
                      onCreate={() => setIsCreateOpen(true)}
                      onEdit={setEditingListing}
                      onView={setViewingListing}
                    />
                  )}

                  {activeTab === "bokningar" && (
                    <HostBookings />
                  )}

                  {activeTab === "meddelanden" && (
                    <div style={{ padding: '20px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Meddelanden</h2>
                      <HostMessages />
                    </div>
                  )}

                  {activeTab !== "boende" && activeTab !== "bokningar" && activeTab !== "meddelanden" && (
                    <div className="placeholder-card">
                      <h2>{tabs.find((tab) => tab.id === activeTab)?.label ?? ""}</h2>
                      <p>Den här designvyn är inte byggd nu.</p>
                    </div>
                  )}
                </section>
              </section>

              {/* MODALER */}
              {isCreateOpen && (
                <div className="modal-backdrop" role="presentation">
                  <div className="modal-panel" role="dialog" aria-modal="true">
                    <ListingForm
                      mode="create"
                      onCancel={() => setIsCreateOpen(false)}
                      onSaved={handleListingCreated}
                    />
                  </div>
                </div>
              )}

              {editingListing && (
                <div className="modal-backdrop" role="presentation">
                  <div className="modal-panel" role="dialog" aria-modal="true">
                    <ListingForm
                      listing={editingListing}
                      mode="edit"
                      onCancel={() => setEditingListing(null)}
                      onSaved={handleListingUpdated}
                    />
                  </div>
                </div>
              )}

              {viewingListing && (
                <div className="modal-backdrop" role="presentation">
                  <div className="modal-panel modal-panel--wide" role="dialog" aria-modal="true">
                    <ListingPreviewModal
                      listing={viewingListing}
                      onClose={() => setViewingListing(null)}
                    />
                  </div>
                </div>
              )}
            </main>
          } 
        />
        
        <Route path="*" element={<div>Sidan hittades inte (404)</div>} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;