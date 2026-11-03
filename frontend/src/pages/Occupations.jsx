import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOccupations } from '../api/occupations';

export default function Occupations() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [request, setRequest] = useState({
    query: '',
    results: [],
    loading: true,
    error: '',
  });

  // Debounce user input by 300ms.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch occupations whenever the debounced query changes.
  useEffect(() => {
    let active = true;

    async function loadOccupations() {
      try {
        const data = await getOccupations({
          search: query,
          limit: 50,
        });

        if (!active) return;

        setRequest({
          query,
          results: data,
          loading: false,
          error: '',
        });
      } catch {
        if (!active) return;

        setRequest({
          query,
          results: [],
          loading: false,
          error: 'Could not load occupations.',
        });
      }
    }

    loadOccupations();

    return () => {
      active = false;
    };
  }, [query]);

  // A search is pending until its matching response arrives.
  const loading = request.loading || search !== query || request.query !== query;

  const { results, error } = request;

  return (
    <main className="container page-content">
      <div className="page-heading">
        <span className="eyebrow">Career explorer</span>
        <h1>Browse occupations</h1>
        <p>Search national occupational data by job title.</p>
      </div>

      <label htmlFor="occupation-search" className="field-label">
        Search occupations
      </label>

      <input
        id="occupation-search"
        className="search-input"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Try software, nurse, analyst..."
      />

      {loading && <p role="status">Searching occupations...</p>}

      {!loading && error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="result-count">Showing {results.length} occupations</p>

          <div className="occupation-list">
            {results.map((occupation) => (
              <Link
                key={occupation.code}
                to={`/occupations/${encodeURIComponent(occupation.code)}`}
                className="occupation-list-item"
              >
                <span>{occupation.title}</span>
                <small>{occupation.code}</small>
              </Link>
            ))}
          </div>

          {results.length === 0 && <p>No occupations match your search.</p>}
        </>
      )}
    </main>
  );
}
