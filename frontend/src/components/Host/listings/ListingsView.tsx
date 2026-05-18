import { Listing } from "../../../types/listingtypes";

const API_BASE_URL = "http://localhost:3002";

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

export default function ListingsView({
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
          + Lägg till boende
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
            <div className="listing-card__image">
              {firstImage ? (
                <img 
                  src={`${API_BASE_URL}${firstImage.url}`} 
                  alt={listing.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              ) : null}
            </div>

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