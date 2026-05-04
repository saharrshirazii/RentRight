import { FormEvent, useEffect, useMemo, useState } from "react";
import FilterSection from "./components/FilterSection/FilterSection";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import PropertyGrid from "./components/PropertyGrid/PropertyGrid";

type Experience = "host" | "explore";

type TabId =
  | "boende"
  | "bokningar"
  | "tillganglighet"
  | "prissattning"
  | "recensioner"
  | "statistik";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "boende", label: "Boende" },
  { id: "bokningar", label: "Bokningar" },
  { id: "tillganglighet", label: "Tillgänglighet" },
  { id: "prissattning", label: "Prissättning" },
  { id: "recensioner", label: "Recensioner" },
  { id: "statistik", label: "Statistik" },
];

const stats = [
  { title: "Totalt intjäning", value: "127 500 kr", meta: "+12% sedan forra manaden", tone: "green" },
  { title: "Antal bokningar", value: "24", meta: "+3 nya denna manad", tone: "blue" },
  { title: "Genomsnittligt betyg", value: "4.8", meta: "Baserat på 83 recensioner", tone: "orange" },
  { title: "Beläggningsgrad", value: "78%", meta: "+5% sedan förra manaden", tone: "cyan" },
];

const API_BASE_URL = "http://localhost:3002";
const defaultAmenities = ["Wifi", "Kök", "Tvättmaskin", "Parkering", "Balkong", "Husdjur tillåtna"];

type ListingImage = {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
  images: ListingImage[];
  createdAt: string;
};

const bookings = [
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Bekraftad",
    statusTone: "blue",
    action: "Bekrafta igen",
  },
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Vantar",
    statusTone: "yellow",
    action: "Godkann",
  },
  {
    title: "Mysig lagenhet i centrum",
    range: "4 april - 18 april 2026",
    nights: "14 natter",
    guests: "2 Gaster",
    total: "6 000 kr",
    status: "Bekraftad",
    statusTone: "blue",
    action: "Reservera sjalv",
  },
];

function App() {
  const [experience, setExperience] = useState<Experience>("host");
  const [activeTab, setActiveTab] = useState<TabId>("boende");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [viewingListing, setViewingListing] = useState<Listing | null>(null);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingError, setListingError] = useState("");
  const [deletingListingId, setDeletingListingId] = useState("");

  const hasOpenModal = isCreateOpen || Boolean(editingListing) || Boolean(viewingListing);

  const fetchListings = async () => {
    setIsLoadingListings(true);
    setListingError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/listnings`);
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
      const response = await fetch(`${API_BASE_URL}/api/listnings/${listingId}`, {
        method: "DELETE",
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

  if (experience === "explore") {
    return <ExploreView onOpenHost={() => setExperience("host")} />;
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
            <h1>Vard Dashboard</h1>
            <p>Hantera dina boenden, bokningar och gaster</p>
          </div>

          <button type="button" className="primary-button" onClick={() => setIsCreateOpen(true)}>
            + Lagg till boende
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

type ListingFormProps = {
  listing?: Listing;
  mode: "create" | "edit";
  onCancel: () => void;
  onSaved: (listing: Listing) => void;
};

function ListingForm({ listing, mode, onCancel, onSaved }: ListingFormProps) {
  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing ? String(listing.price) : "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(listing?.amenities ?? ["Wifi"]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEditing = mode === "edit";

  const imageMetadata = useMemo(() => {
    return Array.from(images ?? []).map((image) => ({
      name: image.name,
      size: `${Math.ceil(image.size / 1024)} KB`,
      type: image.type,
    }));
  }, [images]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((currentAmenities) =>
      currentAmenities.includes(amenity)
        ? currentAmenities.filter((item) => item !== amenity)
        : [...currentAmenities, amenity],
    );
  };

  const addCustomAmenity = () => {
    const trimmedAmenity = customAmenity.trim();
    if (!trimmedAmenity || selectedAmenities.includes(trimmedAmenity)) {
      return;
    }

    setSelectedAmenities((currentAmenities) => [...currentAmenities, trimmedAmenity]);
    setCustomAmenity("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || Number(price) <= 0) {
      setError("Fyll i titel, beskrivning och pris.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("amenities", JSON.stringify(selectedAmenities));
    formData.append("replaceImages", images && images.length > 0 ? "true" : "false");
    Array.from(images ?? []).forEach((image) => formData.append("images", image));

    setIsSubmitting(true);

    try {
      const response = await fetch(
        isEditing && listing
          ? `${API_BASE_URL}/api/listnings/${listing.id}`
          : `${API_BASE_URL}/api/listnings`,
        {
        method: isEditing ? "PUT" : "POST",
        body: formData,
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? (isEditing ? "Kunde inte spara annonsen." : "Kunde inte skapa annonsen."));
      }

      const savedListing = (await response.json()) as Listing;
      onSaved(savedListing);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Något gick fel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-listing-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div className="section-heading__icon">{isEditing ? "✎" : "+"}</div>
        <div>
          <h2 id={isEditing ? "edit-listing-title" : "create-listing-title"}>
            {isEditing ? "Redigera annons" : "Skapa annons"}
          </h2>
          <p>
            {isEditing
              ? "Uppdatera titel, beskrivning, pris, bilder och bekvämligheter."
              : "Lägg till titel, beskrivning, pris, bilder och bekvämligheter."}
          </p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Titel</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Mysig lägenhet i centrum" />
        </label>

        <label className="field">
          <span>Pris per natt</span>
          <input min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="1450" />
        </label>

        <label className="field field--wide">
          <span>Beskrivning</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Beskriv boendet för gästerna" />
        </label>

        <label className="field field--wide">
          <span>Bilder</span>
          <input accept="image/*" multiple type="file" onChange={(event) => setImages(event.target.files)} />
        </label>
      </div>

      {isEditing && listing && listing.images.length > 0 && imageMetadata.length === 0 ? (
        <div className="image-metadata" aria-label="Befintliga bilders metadata">
          {listing.images.map((image) => (
            <span key={image.id}>
              {image.originalName} · {Math.ceil(image.size / 1024)} KB · {image.mimetype}
            </span>
          ))}
        </div>
      ) : null}

      {imageMetadata.length > 0 ? (
        <div className="image-metadata" aria-label="Valda bilders metadata">
          {imageMetadata.map((image) => (
            <span key={`${image.name}-${image.size}`}>
              {image.name} · {image.size} · {image.type}
            </span>
          ))}
        </div>
      ) : null}

      <div className="amenities-panel">
        {defaultAmenities.map((amenity) => (
          <label key={amenity} className="amenity-option">
            <input
              checked={selectedAmenities.includes(amenity)}
              type="checkbox"
              onChange={() => toggleAmenity(amenity)}
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>

      <div className="custom-amenity">
        <input value={customAmenity} onChange={(event) => setCustomAmenity(event.target.value)} placeholder="Lägg till egen bekvämlighet" />
        <button type="button" className="ghost-button" onClick={addCustomAmenity}>
          Lägg till
        </button>
      </div>

      {selectedAmenities.length > 0 ? (
        <div className="listing-card__meta">
          {selectedAmenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Avbryt
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing ? "Sparar..." : "Skapar..."
            : isEditing ? "Spara ändringar" : "Skapa annons"}
        </button>
      </div>
    </form>
  );
}

function ListingPreviewModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasImages = listing.images.length > 0;
  const activeImage = listing.images[activeImageIndex];

  const goToPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? listing.images.length - 1 : currentIndex - 1,
    );
  };

  const goToNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === listing.images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <article className="listing-preview">
      <div className="listing-preview__header">
        <div>
          <h2 id="view-listing-title">{listing.title}</h2>
          <p>{listing.price.toLocaleString("sv-SE")} kr/natt</p>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>
          Stäng
        </button>
      </div>

      <div className="carousel" aria-label="Bildkarusell">
        {hasImages ? (
          <img
            src={`${API_BASE_URL}${activeImage.url}`}
            alt={activeImage.originalName}
            className="carousel__image"
          />
        ) : (
          <div className="carousel__empty">Inga bilder uppladdade</div>
        )}

        {listing.images.length > 1 ? (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--left"
              aria-label="Föregående bild"
              onClick={goToPreviousImage}
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--right"
              aria-label="Nästa bild"
              onClick={goToNextImage}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {listing.images.length > 1 ? (
        <div className="carousel__dots" aria-label="Välj bild">
          {listing.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={index === activeImageIndex ? "carousel__dot is-active" : "carousel__dot"}
              aria-label={`Visa bild ${index + 1}`}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      ) : null}

      <p className="listing-preview__description">{listing.description}</p>
      <div className="listing-card__meta">
        {listing.amenities.map((amenity) => (
          <span key={amenity}>{amenity}</span>
        ))}
      </div>
    </article>
  );
}

type ListingsViewProps = {
  deletingListingId: string;
  error: string;
  isLoading: boolean;
  listings: Listing[];
  onCreate: () => void;
  onDelete: (listingId: string) => void;
  onEdit: (listing: Listing) => void;
  onView: (listing: Listing) => void;
};

function ListingsView({
  deletingListingId,
  error,
  isLoading,
  listings,
  onCreate,
  onDelete,
  onEdit,
  onView,
}: ListingsViewProps) {
  if (isLoading) {
    return <div className="placeholder-card">Hämtar annonser...</div>;
  }

  if (error) {
    return (
      <div className="placeholder-card">
        <h2>Det gick inte att visa annonser</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="empty-listings">
        <h2>Inga annonser ännu</h2>
        <p>Skapa ditt första boende så dyker det upp här.</p>
        <button type="button" className="primary-button" onClick={onCreate}>
          + Lagg till boende
        </button>
      </div>
    );
  }

  return (
    <div className="stack">
      {listings.map((listing) => {
        const firstImage = listing.images[0];

        return (
        <article key={listing.id} className="listing-card">
          <div
            className="listing-card__image"
            aria-hidden="true"
            style={
              firstImage
                ? { backgroundImage: `url(${API_BASE_URL}${firstImage.url})` }
                : undefined
            }
          />

          <div className="listing-card__body">
            <div className="listing-card__top">
              <div>
                <div className="listing-card__title-row">
                  <h2>{listing.title}</h2>
                  <span className="listing-badge">Annons</span>
                </div>
                <p className="listing-card__location">
                  {listing.images.length} bilder uppladdade
                </p>
              </div>

              <div className="listing-card__price">{listing.price.toLocaleString("sv-SE")} kr/natt</div>
            </div>

            <p className="listing-card__description">{listing.description}</p>

            <div className="listing-card__meta">
              {listing.amenities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="listing-card__actions">
              <button type="button" className="ghost-button" onClick={() => onView(listing)}>
                Visa
              </button>
              <button type="button" className="ghost-button" onClick={() => onEdit(listing)}>
                Redigera
              </button>
              <button
                type="button"
                className="ghost-button ghost-button--danger"
                disabled={deletingListingId === listing.id}
                onClick={() => onDelete(listing.id)}
              >
                {deletingListingId === listing.id ? "Tar bort..." : "Ta bort"}
              </button>
            </div>
          </div>
        </article>
        );
      })}
    </div>
  );
}

function BookingsView() {
  return (
    <div className="bookings-panel">
      <div className="section-heading">
        <div className="section-heading__icon">▣</div>
        <div>
          <h2>Alla bokningar</h2>
          <p>Hantera och folj upp dina bokningar</p>
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
                  className={
                    booking.statusTone === "yellow"
                      ? "mini-action mini-action--green"
                      : "mini-action"
                  }
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

function ExploreView({ onOpenHost }: { onOpenHost: () => void }) {
  return (
    <main>
      <Navbar />
      <div className="explore-host-switch">
        <button type="button" className="primary-button" onClick={onOpenHost}>
          Mina boenden
        </button>
      </div>
      <Hero />
      <FilterSection />
      <PropertyGrid />
    </main>
  );
}

function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="placeholder-card">
      <h2>{label}</h2>
      <p>Den har designvyn ar inte byggd nu. Just nu finns bara layouten for Boende och Bokningar enligt referensen.</p>
    </div>
  );
}

export default App;
