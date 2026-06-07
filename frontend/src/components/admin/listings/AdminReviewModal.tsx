import React, { useState } from 'react';
import { Listing } from '../../../types/listingtypes';

interface AdminReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  onReview: (status: 'approved' | 'needs_revision' | 'rejected', feedback: string) => void;
}

const API_BASE_URL = "http://localhost:3000";

export const AdminReviewModal: React.FC<AdminReviewModalProps> = ({ isOpen, onClose, listing, onReview }) => {
  const [decision, setDecision] = useState<'approved' | 'needs_revision' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const images = listing.images || [];
  const currentImage = images[currentImageIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((decision === 'needs_revision' || decision === 'rejected') && !feedback.trim()) {
      alert('En kommentar måste anges för detta beslut.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReview(decision, feedback.trim());
      onClose();
    } catch (error) {
      console.error('Review failed:', error);
      alert('Kunde inte spara granskningen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel modal-panel--wide" role="dialog" aria-modal="true">
        <form className="create-listing-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div className="section-heading__icon">📋</div>
            <div>
              <h2>Granska boende</h2>
              <p>Granska boendet och fatta beslut om godkännande, komplettering eller nekande.</p>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Titel</span>
              <input value={listing.title} disabled />
            </label>

            <label className="field">
              <span>Pris per natt</span>
              <input value={`${listing.price} kr`} disabled />
            </label>

            <label className="field field--wide">
              <span>Beskrivning</span>
              <textarea value={listing.description} disabled rows={4} />
            </label>
          </div>

          {/* Bildvisning */}
          {images.length > 0 && (
            <div className="image-list" aria-label="Uppladdade bilder">
              <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '16px' }}>
                <img 
                  src={currentImage.url.startsWith('http') ? currentImage.url : `${API_BASE_URL}${currentImage.url}`}
                  alt={currentImage.originalName}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '12px' 
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button 
                      type="button"
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      ‹
                    </button>
                    <button 
                      type="button"
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      ›
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                  <div 
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '3px solid #4f46e5' : '2px solid #e5e7eb',
                      opacity: index === currentImageIndex ? 1 : 0.6
                    }}
                  >
                    <img 
                      src={image.url.startsWith('http') ? image.url : `${API_BASE_URL}${image.url}`}
                      alt={image.originalName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bekvämligheter */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="amenities-panel">
              {listing.amenities.map((amenity) => (
                <span key={amenity} style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {/* Beslutsval */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#3730a3', marginBottom: '12px' }}>
              Beslut
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                cursor: 'pointer',
                backgroundColor: decision === 'approved' ? '#f0fdf4' : 'white',
                borderColor: decision === 'approved' ? '#22c55e' : '#e5e7eb'
              }}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="approved"
                  checked={decision === 'approved'}
                  onChange={(e) => setDecision(e.target.value as any)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  ✅ Godkänn (Publicera direkt)
                </span>
              </label>
              
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                cursor: 'pointer',
                backgroundColor: decision === 'needs_revision' ? '#fff7ed' : 'white',
                borderColor: decision === 'needs_revision' ? '#f97316' : '#e5e7eb'
              }}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="needs_revision"
                  checked={decision === 'needs_revision'}
                  onChange={(e) => setDecision(e.target.value as any)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  🔄 Begär komplettering
                </span>
              </label>
              
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                cursor: 'pointer',
                backgroundColor: decision === 'rejected' ? '#fef2f2' : 'white',
                borderColor: decision === 'rejected' ? '#ef4444' : '#e5e7eb'
              }}>
                <input 
                  type="radio" 
                  name="decision" 
                  value="rejected"
                  checked={decision === 'rejected'}
                  onChange={(e) => setDecision(e.target.value as any)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  ❌ Neka (Skicka meddelande)
                </span>
              </label>
            </div>
          </div>

          {/* Feedback-fält */}
          {(decision === 'needs_revision' || decision === 'rejected') && (
            <label className="field field--wide" style={{ marginTop: '16px' }}>
              <span>Meddelande till användaren (obligatoriskt)</span>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={decision === 'needs_revision' ? 'Beskriv vad värden behöver komplettera...' : 'Ange anledning till att annonsen nekas...'}
                rows={4}
                required
              />
            </label>
          )}

          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={onClose} disabled={isSubmitting}>
              Avbryt
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sparar...' : 'Spara granskning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};