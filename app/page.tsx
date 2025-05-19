'use client';

import { useState } from 'react';


export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const offset = "0";
  const limit = "10";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    const url = new URL('/api/4shared');
    url.searchParams.append('query', query);
    url.searchParams.append('offset', offset);
    url.searchParams.append('limit', limit);
    url.searchParams.append('sort', 'name,desc');
    url.searchParams.append('type', 'mp3');
    
    // Realizar la solicitud GET
    try {
      const res = await fetch('/api/4shared', {
        method: 'GET',
        body: JSON.stringify({ q: query }),
      });
      

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setResults(data.files || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscar en 4shared</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Buscar archivos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-2 w-full"
        >
          Buscar
        </button>
      </form>

      {loading && <p>Buscando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul>
        {results.map((file, idx) => (
          <li key={idx} className="mb-2">
            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
