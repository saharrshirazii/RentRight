import React, { useState, useEffect } from 'react';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  type: 'text' | 'listing_deleted';
  listingId?: string;
  listingTitle?: string;
  deletionReason?: string;
  createdAt: string;
}

export const HostMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Du måste vara inloggad för att se meddelanden.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/messages/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Kunde inte hämta meddelanden.');
        }

        const data = await response.json();
        console.log('Messages data:', data);
        setMessages(data.data || []);
      } catch (err) {
        setError('Kunde inte ladda meddelanden.');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Laddar meddelanden...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (messages.length === 0) {
    return <div className="p-8 text-center text-gray-400">Inga meddelanden än.</div>;
  }

  const handleDeleteMessage = async (messageId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Du måste vara inloggad för att radera meddelanden.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Kunde inte ta bort meddelandet.');
      }

      setMessages((currentMessages) => currentMessages.filter((message) => message._id !== messageId));
    } catch (err) {
      setError('Kunde inte ta bort meddelandet.');
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`bg-white border rounded-xl p-4 shadow-sm ${
            message.type === 'listing_deleted' ? 'border-red-200 bg-red-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2 gap-3">
            <div>
              <span className={`text-xs font-semibold ${
                message.type === 'listing_deleted' ? 'text-red-600' : 'text-indigo-600'
              }`}>
                {message.type === 'listing_deleted' ? '⚠️ Boende borttaget' : 'Meddelande från admin'}
              </span>
              <div className="text-xs text-gray-400 mt-1">
                {message.createdAt ? new Date(message.createdAt).toLocaleDateString('sv-SE') : 'N/A'}
              </div>
            </div>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800"
              onClick={() => {
                if (window.confirm('Vill du verkligen ta bort det här meddelandet?')) {
                  void handleDeleteMessage(message._id);
                }
              }}
            >
              Ta bort
            </button>
          </div>

          {message.type === 'listing_deleted' ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{message.text}</p>
              {message.listingTitle && (
                <div className="bg-white rounded-lg p-3 border border-red-100">
                  <p className="text-xs font-semibold text-gray-900 mb-1">Borttaget boende:</p>
                  <p className="text-sm font-medium text-gray-800">{message.listingTitle}</p>
                  {message.deletionReason && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Anledning:</p>
                      <p className="text-sm text-gray-600">{message.deletionReason}</p>
                    </div>
                  )}
                </div>
              )}
              {!message.listingTitle && message.text && (
                <p className="text-sm text-gray-600 italic">{message.text}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-700">{message.text}</p>
          )}
        </div>
      ))}
    </div>
  );
};
