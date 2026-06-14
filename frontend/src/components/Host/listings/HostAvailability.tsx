import React from 'react';
import { Listing } from '../../../types/listingtypes';

type HostAvailabilityProps = {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
};

const formatRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${start} – ${end}`;
};

export default function HostAvailability({ listings, onEdit }: HostAvailabilityProps) {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Tillgänglighetskalender</h2>
      <p style={{ maxWidth: '720px', marginBottom: '24px', color: '#4b5563' }}>
        Här ser du vilka datum du har öppet för bokningar per boende. Redigera ett boende för att lägga till eller ändra tillgänglighetsintervaller.
      </p>

      {listings.length === 0 ? (
        <div className="placeholder-card">
          <h3>Inga annonser hittades</h3>
          <p>Skapa ett boende först och ange därefter tillgänglighet.</p>
        </div>
      ) : (
        <div className="stack">
          {listings.map((listing) => {
            const listingId = listing.id || listing._id || 'unknown';
            return (
              <article key={listingId} className="listing-card">
                <div className="listing-card__body">
                  <div className="listing-card__top" style={{ marginBottom: '16px' }}>
                    <div>
                      <h3>{listing.title}</h3>
                      <p style={{ margin: 0, color: '#6b7280' }}>{listing.location || 'Plats ej angiven'}</p>
                    </div>
                    <button type="button" className="ghost-button" onClick={() => onEdit(listing)}>
                      Redigera tillgänglighet
                    </button>
                  </div>

                  {listing.availability && listing.availability.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {listing.availability.map((range, index) => (
                        <div key={`${listingId}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
                          <span>{formatRange(range.startDate, range.endDate)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                      Ingen tidsperiod har lagts till för detta boende ännu. Redigera för att ange tillgänglighet.
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
