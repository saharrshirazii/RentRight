import React, { useState, useEffect } from "react";


interface Booking {
  _id: string;
  propertyTitle?: string; 
  property?: { title: string }; 
  guestName?: string; 
  user?: { name: string }; 
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "Bekräftad" | "Väntar" | "Nekad";
}

const API_BASE_URL = "http://localhost:3000";

const HostBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Hämta alla bokningar som gjorts till den inloggade värdens boenden
  const fetchHostBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/host`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Kunde inte hämta dina bokningar.");
      }

      const resData = await response.json();
      
      const actualBookings = Array.isArray(resData) ? resData : resData.data || [];
      setBookings(actualBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel vid hämtning.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchHostBookings();
  }, []);

  
  const handleUpdateStatus = async (bookingId: string, newStatus: "Bekräftad" | "Nekad") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}`, {
        method: "PATCH", // eller PUT beroende på din backend
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });

      if (response.ok) {
        
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error("Kunde inte uppdatera bokningsstatus", err);
    }
  };

  
  const formatDateRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${start.toLocaleDateString('sv-SE', options)} - ${end.toLocaleDateString('sv-SE', { ...options, year: 'numeric' })}`;
  };

  
  const calculateNights = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} nätter`;
  };

  if (isLoading) return <div className="placeholder-card">Laddar bokningar...</div>;
  if (error) return <div className="placeholder-card"><h2>Ett fel uppstod</h2><p>{error}</p></div>;

  if (bookings.length === 0) {
    return (
      <div className="placeholder-card" style={{ padding: "40px", textAlign: "center" }}>
        <h2>Inga bokningar ännu</h2>
        <p style={{ color: "#6b7280" }}>När gäster bokar dina boenden kommer de att dyka upp här!</p>
      </div>
    );
  }

  return (
    <div className="bookings-panel" style={{ padding: "20px" }}>
      <div className="section-heading" style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
        <div className="section-heading__icon" style={{ fontSize: "24px" }}>📅</div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Alla bokningar</h2>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Hantera och följ upp dina bokningar</p>
        </div>
      </div>

      <div className="stack" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {bookings.map((booking) => {
          
          const title = booking.propertyTitle || booking.property?.title || "Bokat boende";
          const guestName = booking.guestName || booking.user?.name || "Gäst";
          const dateRange = formatDateRange(booking.startDate, booking.endDate);
          const nights = calculateNights(booking.startDate, booking.endDate);
          
          
          const statusTone = booking.status === "Bekräftad" ? "blue" : booking.status === "Väntar" ? "yellow" : "red";

          return (
            <article 
              key={booking._id} 
              className="booking-card"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                backgroundColor: "#fff"
              }}
            >
              <div 
                className="booking-avatar" 
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "50%", 
                  backgroundColor: "#e5e7eb",
                  backgroundImage: `url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80')`,
                  backgroundSize: "cover",
                  marginRight: "20px"
                }} 
              />

              <div className="booking-card__body" style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>{title}</h3>
                  <p style={{ color: "#4b5563", fontSize: "14px", margin: "2px 0" }}>👤 {guestName}</p>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: "2px 0" }}>📅 {dateRange}</p>
                  <p style={{ color: "#9ca3af", fontSize: "12px", margin: "2px 0" }}>{nights}</p>
                </div>

                <div className="booking-card__summary" style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: "8px" }}>
                  <strong style={{ fontSize: "20px", color: "#111827" }}>{booking.totalPrice.toLocaleString("sv-SE")} kr</strong>
                  
                  <span className={`status-pill status-pill--${statusTone}`}>
                    {booking.status}
                  </span>

                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {booking.status === "Väntar" ? (
                      <>
                        <button 
                          type="button" 
                          onClick={() => handleUpdateStatus(booking._id, "Bekräftad")}
                          style={{ backgroundColor: "#22c55e", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}
                        >
                          ✓ Godkänn
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleUpdateStatus(booking._id, "Nekad")}
                          style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}
                        >
                          ✕ Neka
                        </button>
                      </>
                    ) : (
                      booking.status === "Bekräftad" && (
                        <button type="button" className="ghost-button" style={{ fontSize: "13px", padding: "6px 12px" }}>
                          ⭐ Recensera gäst
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default HostBookings;