'use client';

import { useState } from 'react';
import './styles.css'; // archivo de estilos tradicional

export default function Home() {
  const [query, setQuery] = useState('DCIM');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/4shared');
      if (!res.ok) throw new Error('Error: Algo salió mal');
      const data = await res.json();
      setResults(data.files || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  return (
    <main className="container">
      <h1 className="title">Buscar en 4shared</h1>
      <form onSubmit={handleSearch} className="form">
        <input
          type="text"
          placeholder="Buscar archivos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">
          Buscar
        </button>
      </form>

      {loading && <p>Buscando...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="results">
        {results.map((file, idx) => (
          <li key={idx} className="result-item">
            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
