import { FormEvent, useEffect, useMemo, useState } from "react";
import { Listing, ListingImage } from "../../../types/listingtypes";

// Konstanter som komponenten behöver
const API_BASE_URL = "http://localhost:3002";
const defaultAmenities = ["Wifi", "Kök", "Tvättmaskin", "Parkering", "Balkong", "Husdjur tillåtna"];

type ListingFormProps = {
  listing?: Listing;
  mode: "create" | "edit";
  onCancel: () => void;
  onSaved: (listing: Listing) => void;
};

export default function ListingForm({ listing, mode, onCancel, onSaved }: ListingFormProps) {
  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing ? String(listing.price) : "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(listing?.amenities ?? ["Wifi"]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [existingImages, setExistingImages] = useState<ListingImage[]>(listing?.images ?? []);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEditing = mode === "edit";

  const imageMetadata = useMemo(() => {
    return images.map((image) => ({
      name: image.name,
      previewUrl: URL.createObjectURL(image),
      size: `${Math.ceil(image.size / 1024)} KB`,
      type: image.type,
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      imageMetadata.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [imageMetadata]);

  const handleImageSelection = (selectedFiles: FileList | null, inputElement?: HTMLInputElement) => {
    if (!selectedFiles) return;
    const fileArray = Array.from(selectedFiles);
    
    setImages((currentImages) => [...currentImages, ...fileArray]);
    if (inputElement) inputElement.value = "";
  };

  const removeNewImage = (imageIndex: number) => {
    setImages((currentImages) => currentImages.filter((_image, index) => index !== imageIndex));
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((currentImages) => currentImages.filter((image) => image.id !== imageId));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((currentAmenities) =>
      currentAmenities.includes(amenity)
        ? currentAmenities.filter((item) => item !== amenity)
        : [...currentAmenities, amenity],
    );
  };

  const addCustomAmenity = () => {
    const trimmedAmenity = customAmenity.trim();
    if (!trimmedAmenity || selectedAmenities.includes(trimmedAmenity)) return;

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
    formData.append("keepImageIds", JSON.stringify(existingImages.map((image) => image.id)));
    
    images.forEach((image) => {
      formData.append("images", image);
    });

    setIsSubmitting(true);

    try {
      const response = await fetch(
        isEditing && listing
          ? `${API_BASE_URL}/api/v1/listnings/${listing.id}`
          : `${API_BASE_URL}/api/v1/listnings`,
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? (isEditing ? "Kunde inte spara annonsen." : "Kunde inte skapa annonsen."));
      }

      const savedListing = (await response.json()) as Listing;
      onSaved(savedListing);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ett oväntat fel uppstod.");
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
          <input
            accept="image/*"
            multiple
            type="file"
            onChange={(event) => handleImageSelection(event.target.files, event.target)}
          />
        </label>
      </div>

      {isEditing && existingImages.length > 0 ? (
        <div className="image-list" aria-label="Befintliga bilder">
          {existingImages.map((image) => (
            <div key={image.id} className="image-list__item">
              <img src={`${API_BASE_URL}${image.url}`} alt={image.originalName} className="image-list__preview" />
              <span>{image.originalName} · {Math.ceil(image.size / 1024)} KB · {image.mimetype}</span>
              <button type="button" className="ghost-button ghost-button--danger" onClick={() => removeExistingImage(image.id)}>
                Ta bort bild
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {imageMetadata.length > 0 ? (
        <div className="image-list" aria-label="Valda bilders metadata">
          {imageMetadata.map((image, index) => (
            <div key={`${image.name}-${image.size}-${index}`} className="image-list__item">
              <img src={image.previewUrl} alt={image.name} className="image-list__preview" />
              <span>{image.name} · {image.size} · {image.type}</span>
              <button type="button" className="ghost-button ghost-button--danger" onClick={() => removeNewImage(index)}>
                Ta bort bild
              </button>
            </div>
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