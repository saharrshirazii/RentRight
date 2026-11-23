import { Listing, ListingStatus } from "../../../types/listingtypes";

const API_BASE_URL = "http://localhost:3000";

const getStatusClass = (status: ListingStatus): string => {
  switch (status) {
    case 'pending': return 'status-pill--pending';
    case 'approved': return 'status-pill--approved';
    case 'needs_revision': return 'status-pill--needs-revision';
    case 'rejected': return 'status-pill--rejected';
    default: return 'status-pill--pending';
  }
};

const getStatusLabel = (status: ListingStatus): string => {
  switch (status) {
    case 'pending': return 'Väntar på granskning';
    case 'approved': return 'Godkänd';
    case 'needs_revision': return 'Behöver komplettering';
    case 'rejected': return 'Nekad';
    default: return status;
  }
};

type ListingsViewProps = {
  deletingListingId: string;
  error: string;
  isLoading: boolean;
  listings: Listing[];
  onCreate: () => void;
  onEdit: (listing: Listing) => void;
  onView: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
};

export default function ListingsView({
  deletingListingId,
  error,
  isLoading,
  listings,
  onCreate,
  onEdit,
  onView,
  onDelete,
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
        
        const currentListingId = listing.id || (listing as any)._id;
        const firstImage = listing.images && listing.images[0];
        const status = listing.status || 'pending';

        return (
          <article key={currentListingId} className="listing-card">
            <div className="listing-card__image">
              {firstImage ? (
                <img 
                  src={
                    firstImage.url.startsWith('http') 
                      ? firstImage.url 
                      : `${API_BASE_URL}${firstImage.url}`
                  } 
                  alt={listing.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af'
                }}>
                  Ingen bild uppladdad
                </div>
              )}
            </div>

            <div className="listing-card__body">
              <div className="listing-card__top">
                <div>
                  <div className="listing-card__title-row">
                    <h2>{listing.title}</h2>
                    <span className={`listing-badge ${getStatusClass(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#eef2ff',
                      color: '#3730a3'
                    }}>
                      {listing.propertyType ?? 'Lägenhet'}
                    </span>
                    <p className="listing-card__location" style={{ margin: 0 }}>
                      {listing.location || "Plats ej angiven"} · {listing.images ? listing.images.length : 0} bilder uppladdade
                    </p>
                  </div>
                </div>

                <div className="listing-card__price">{listing.price.toLocaleString("sv-SE")} kr/natt</div>
              </div>

              <p className="listing-card__description">{listing.description}</p>

              <div className="listing-card__meta">
                <span>{listing.guests ?? 1} gäster</span>
                <span>{listing.bedrooms ?? 0} sovrum</span>
                <span>{listing.bathrooms ?? 0} badrum</span>
              </div>

              {listing.adminFeedback && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  <strong>Feedback från admin:</strong> {listing.adminFeedback}
                </div>
              )}

              <div className="listing-card__meta">
                {listing.amenities && listing.amenities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="listing-card__actions">
                <button type="button" className="ghost-button" onClick={() => onView(listing)}>
                  Visa
                </button>
                <button 
                  type="button" 
                  className="ghost-button" 
                  onClick={() => onEdit(listing)}
                >
                  Redigera
                </button>
                {status === 'rejected' && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      const shouldDelete = window.confirm(`Är du säker på att du vill ta bort listingen "${listing.title}"?`);
                      if (shouldDelete) {
                        onDelete(listing);
                      }
                    }}
                    disabled={deletingListingId === currentListingId}
                    style={{ marginLeft: '12px' }}
                  >
                    {deletingListingId === currentListingId ? 'Tar bort...' : 'Ta bort'}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
