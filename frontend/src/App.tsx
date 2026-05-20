import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import PropertyGrid from "./components/PropertyGrid/PropertyGrid";
import ProfilePage from "./pages/profile/ProfilePage";
import ListingForm from "./components/Host/listings/ListingForm";
import ListingPreviewModal from "./components/Host/listings/ListingPreviewModal";
import ListingsView from "./components/Host/listings/ListingsView";
import { Listing, TabId } from "./types/listingtypes";

type Experience = "host" | "explore" | "profile";

const API_BASE_URL = "http://localhost:3002";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "boende", label: "Boende" },
  { id: "bokningar", label: "Bokningar" },
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

const bookings = [
  {
    title: "Mysig lägenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 nätter",
    guests: "2 Gäster",
    total: "6 000 kr",
    status: "Bekräftad",
    statusTone: "blue",
    action: "Bekräfta igen",
  },
  {
    title: "Mysig lägenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 nätter",
    guests: "2 Gäster",
    total: "6 000 kr",
    status: "Väntar",
    statusTone: "yellow",
    action: "Godkänn",
  },
  {
    title: "Mysig lägenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 nätter",
    guests: "2 Gäster",
    total: "6 000 kr",
    status: "Bekräftad",
    statusTone: "blue",
    action: "Reservera själv",
  },
];

function App() {
  const [experience, setExperience] = useState<Experience>("explore");
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
      return { name: "Användare", role: "guest", email: "" };
    }
  }
  return { name: "Användare", role: "guest", email: "" };
});

  const hasOpenModal = isCreateOpen || Boolean(editingListing) || Boolean(viewingListing);

  const fetchListings = async () => {
    setIsLoadingListings(true);
    setListingError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/listnings`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Kunde inte hämta annonser.");
      }

      const data = (await response.json()) as Listing[];
      setListings(data);
    } catch {
      setListingError("Backend svarar inte just nu. Starta backend och försök igen.");
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    void fetchListings();
  }, []);

  const handleListingCreated = (listing: Listing) => {
    setListings((currentListings) => [listing, ...currentListings]);
    setIsCreateOpen(false);
    setActiveTab("boende");
  };

  const handleListingUpdated = (updatedListing: Listing) => {
    setListings((currentListings) =>
      currentListings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing,
      ),
    );
    setEditingListing(null);
  };

  const handleDeleteListing = async (listingId: string) => {
    setDeletingListingId(listingId);
    setListingError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/listnings/${listingId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Kunde inte ta bort annonsen.");
      }

      setListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== listingId),
      );
    } catch (deleteError) {
      setListingError(deleteError instanceof Error ? deleteError.message : "Något gick fel.");
    } finally {
      setDeletingListingId("");
    }
  };

  if (experience === "profile") {
  return( 
  <ProfilePage 
  setExperience={setExperience}
  userData={userData || { name: "Laddar...", role: "guest"}}
  setUserData={setUserData}
  />
  );
}

  if (experience === "explore") {
    return <ExploreView onOpenHost={() => setExperience("host")} 
    setExperience={setExperience}
    userData={userData} />;
  }

  return (
    <main className="host-shell">
      <section className={hasOpenModal ? "host-frame is-blurred" : "host-frame"}>
        <header className="topbar">
          <div className="brand">RentRight</div>

          <nav className="quick-nav" aria-label="Main navigation">
            <button type="button" className="quick-nav__icon" aria-label="Theme toggle">
              ◔
            </button>
            <button
              type="button"
              className="quick-nav__item"
              onClick={() => setExperience("explore")}
            >
              Utforska
            </button>
            <button type="button" className="quick-nav__item quick-nav__item--active">
              Mina boenden
            </button>
            <button type="button" className="quick-nav__item">
              Profil
            </button>
          </nav>

          <div className="topbar__actions">
            <span className="user-name">Anna Andersson</span>
            <button type="button" className="logout-button">
              Logga ut
            </button>
          </div>
        </header>

        <section className="page-header">
          <div>
            <h1>Värd Dashboard</h1>
            <p>Hantera dina boenden, bokningar och gäster</p>
          </div>

          <button type="button" className="primary-button" onClick={() => setIsCreateOpen(true)}>
            + Lägg till boende
          </button>
        </section>

        <section className="stats-grid" aria-label="Host statistics">
          {stats.map((stat) => (
            <article key={stat.title} className={`stat-card stat-card--${stat.tone}`}>
              <span className="stat-card__title">{stat.title}</span>
              <strong className="stat-card__value">{stat.value}</strong>
              <span className="stat-card__meta">{stat.meta}</span>
            </article>
          ))}
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
          {activeTab === "boende" ? (
            <ListingsView
              deletingListingId={deletingListingId}
              error={listingError}
              isLoading={isLoadingListings}
              listings={listings}
              onCreate={() => setIsCreateOpen(true)}
              onDelete={handleDeleteListing}
              onEdit={setEditingListing}
              onView={setViewingListing}
            />
          ) : null}
          {activeTab === "bokningar" ? <BookingsView /> : null}
          {activeTab !== "boende" && activeTab !== "bokningar" ? (
            <PlaceholderView label={tabs.find((tab) => tab.id === activeTab)?.label ?? ""} />
          ) : null}
        </section>
      </section>

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="create-listing-title">
            <ListingForm
              mode="create"
              onCancel={() => setIsCreateOpen(false)}
              onSaved={handleListingCreated}
            />
          </div>
        </div>
      ) : null}

      {editingListing ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="edit-listing-title">
            <ListingForm
              listing={editingListing}
              mode="edit"
              onCancel={() => setEditingListing(null)}
              onSaved={handleListingUpdated}
            />
          </div>
        </div>
      ) : null}

      {viewingListing ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel modal-panel--wide" role="dialog" aria-modal="true" aria-labelledby="view-listing-title">
            <ListingPreviewModal
              listing={viewingListing}
              onClose={() => setViewingListing(null)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

// (Behåll BookingsView, ExploreView och PlaceholderView här eller flytta ut dem också vid behov)
function BookingsView() {
  return (
    <div className="bookings-panel">
      <div className="section-heading">
        <div className="section-heading__icon">▣</div>
        <div>
          <h2>Alla bokningar</h2>
          <p>Hantera och följ upp dina bokningar</p>
        </div>
      </div>

      <div className="stack">
        {bookings.map((booking, index) => (
          <article key={`${booking.title}-${index}`} className="booking-card">
            <div className="booking-avatar" aria-hidden="true" />
            <div className="booking-card__body">
              <div>
                <h3>{booking.title}</h3>
                <p>{booking.nights}</p>
                <p>{booking.range}</p>
                <p>{booking.guests}</p>
              </div>
              <div className="booking-card__summary">
                <strong>{booking.total}</strong>
                <span className={`status-pill status-pill--${booking.statusTone}`}>
                  {booking.status}
                </span>
                <button
                  type="button"
                  className={booking.statusTone === "yellow" ? "mini-action mini-action--green" : "mini-action"}
                >
                  {booking.action}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ExploreView({ onOpenHost, setExperience, userData }: { onOpenHost: () => void, setExperience: (exp: Experience) => void,
  userData: any;
 }) {
  return (
    <main>
      <Navbar setExperience={setExperience}/>

      {userData.role === 'host' && (

      <div className="explore-host-switch">
        <button type="button" className="primary-button" onClick={onOpenHost}>
          Mina boenden
        </button>
      </div>
      )}

      <Hero />
      <PropertyGrid />
    </main>
  );
}

function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="placeholder-card">
      <h2>{label}</h2>
      <p>Den här designvyn är inte byggd nu. Just nu finns bara layouten för Boende och Bokningar enligt referensen.</p>
    </div>
  );
}

export default App;