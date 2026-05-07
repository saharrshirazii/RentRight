import React, { useState } from 'react';

const CreateListing: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  return (
    <div>
      <h2>Skapa annons</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <img src={previewUrl} alt="Förhandsvisning" style={{ maxWidth: 200, maxHeight: 200 }} />
          <br />
          <button onClick={handleRemoveFile}>Radera bild</button>
        </div>
      )}
      {/* Lägg till övriga fält för annonsen här */}
    </div>
  );
};

export default CreateListing;
