import React, { useEffect, useState } from 'react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
  isActive: boolean;
  createdAt?: string;
}

export const AdminTabUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3000';

  const fetchUsers = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Du måste vara inloggad som admin för att se användare.');
        setUsers([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/users?role=host`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Kunde inte hämta användare.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error('Fel vid hämtning av användare:', error);
      setMessage(error.message || 'Något gick fel vid hämtning av användare.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id: string, isActive: boolean) => {
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Kunde inte ändra användarstatus.');
      }

      setUsers((prevUsers) => prevUsers.map((user) => user._id === id ? { ...user, isActive } : user));
      setMessage(isActive ? 'Användaren har aktiverats.' : 'Användaren har inaktiverats.');
    } catch (error: any) {
      console.error('Fel vid uppdatering av användare:', error);
      setMessage(error.message || 'Fel vid uppdatering av användarstatus.');
    }
  };

  const deleteUser = async (id: string) => {
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Kunde inte ta bort användaren.');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setMessage('Användaren har tagits bort.');
    } catch (error: any) {
      console.error('Fel vid radering av användare:', error);
      setMessage(error.message || 'Fel vid radering av användaren.');
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const visibleUsers = users.filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50/50">
        <div>
          <p className="text-sm font-bold text-gray-900">👥 Host-användare</p>
          <p className="text-xs text-gray-500 mt-1">Här ser du värdar som loggar in med host-konto. Administratören kan inaktivera eller radera dem.</p>
        </div>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          type="text"
          placeholder="Sök användare..."
          className="text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
        />
      </div>

      {message && (
        <div className="px-4 py-3 text-sm text-gray-800 bg-yellow-50 border-t border-yellow-100">
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="p-4">Namn</th>
              <th className="p-4">E-post</th>
              <th className="p-4">Roll</th>
              <th className="p-4">Status</th>
              <th className="p-4">Medlem sedan</th>
              <th className="p-4 text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Laddar användare...</td>
              </tr>
            ) : visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">Inga användare hittades.</td>
              </tr>
            ) : (
              visibleUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 text-gray-900 font-semibold">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-semibold ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {user.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('sv-SE') : '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => updateUserStatus(user._id, !user.isActive)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border ${user.isActive ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100' : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'}`}
                    >
                      {user.isActive ? 'Inaktivera' : 'Aktivera'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUser(user._id)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
