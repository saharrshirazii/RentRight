import { useState } from "react";
import { Listing } from "../../../types/listingtypes";

const API_BASE_URL = "http://localhost:3000";

type ListingPreviewModalProps = {
  listing: Listing;
  onClose: () => void;
};

export default function ListingPreviewModal({ listing, onClose }: ListingPreviewModalProps) {
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
          <p>{listing.location || "Plats ej angiven"} · {listing.price.toLocaleString("sv-SE")} kr/natt</p>
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
        <span>{listing.guests ?? 1} gäster</span>
        <span>{listing.bedrooms ?? 0} sovrum</span>
        <span>{listing.bathrooms ?? 0} badrum</span>
      </div>
      <div className="listing-card__meta">
        {listing.amenities.map((amenity) => (
          <span key={amenity}>{amenity}</span>
        ))}
      </div>
    </article>
  );
}
