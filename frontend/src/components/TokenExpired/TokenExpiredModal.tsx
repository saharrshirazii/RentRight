import './TokenExpiredModal.css'

interface TokenExpiredModalProps{
    isOpen: boolean;
    onClose: () => void;
}

export const TokenExpiredModal = ({ isOpen, onClose } : TokenExpiredModalProps ) => {
    if(!isOpen) return null;

    return (
        <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Sessionen har gått ut</h2>
        </div>
        <div className="modal-body">
          <p>Din inloggning har löpt ut av säkerhetsskäl. Vänligen logga in igen för att fortsätta använda alla funktioner i appen.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Stäng</button>
        </div>
      </div>
    </div>
  );
}