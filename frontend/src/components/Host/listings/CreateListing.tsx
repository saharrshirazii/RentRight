
import React, { useState } from 'react';

const CreateListing: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      if (selectedFile) {
        formData.append('images', selectedFile);
      }

      const res = await fetch('http://localhost:3000/api/v1/listnings', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Något gick fel vid uppladdning.');
      }
      setSuccess('Annons skapad!');
      setTitle('');
      setDescription('');
      setPrice('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || 'Något gick fel vid uppladdning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Skapa annons</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titel:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Beskrivning:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Pris:</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {previewUrl && (
          <div style={{ marginTop: 16 }}>
            <img src={previewUrl} alt="Förhandsvisning" style={{ maxWidth: 200, maxHeight: 200 }} />
            <br />
            <button type="button" onClick={handleRemoveFile}>Radera bild</button>
          </div>
        )}
        <button type="submit" disabled={loading}>{loading ? 'Skickar...' : 'Skapa annons'}</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </form>
    </div>
  );
};

export default CreateListing;
