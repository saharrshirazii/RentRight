import React, { useState, useEffect } from 'react';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
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

        const response = await fetch(`${API_BASE_URL}/api/v1/messages/inbox`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Kunde inte hämta meddelanden.');
        }

        const data = await response.json();
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

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message._id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-indigo-600">
              Meddelande från admin
            </span>
            <span className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleDateString('sv-SE')}
            </span>
          </div>
          <p className="text-sm text-gray-700">{message.text}</p>
        </div>
      ))}
    </div>
  );
};
