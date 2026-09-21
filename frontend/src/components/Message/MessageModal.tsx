import { useState } from 'react';


interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  propertyTitle: string;
}


export const MessageModal = ({ isOpen, onClose, recipientId, propertyTitle }: MessageModalProps) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://localhost:3000/api/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ recipientId, content: message, propertyTitle })
      });

      if (response.ok) {
        onClose();
        alert("Meddelande skickat!");
      } else {
        alert("Något gick fel när meddelandet skulle skickas.");
      }
    } catch (error) {
      console.error("Fel vid skickande:", error);
      alert("Kunde inte ansluta till servern.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
        <h3 className="font-bold mb-4">Skicka meddelande om {propertyTitle}</h3>
        <textarea 
          className="w-full border p-2 rounded-lg mb-4"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hej! Jag är intresserad av detta boende..."
          value={message}
        />
        <div className="flex gap-2">
          <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Skicka</button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Avbryt</button>
        </div>
      </div>
    </div>
  );
};