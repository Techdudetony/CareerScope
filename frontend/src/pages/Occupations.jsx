import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOccupations } from '../api/occupations';

const PAGE_SIZE = 25;

export default function Occupations() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const [request, setRequest] = useState({
    query: '',
    page: 1,
    results: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadOccupations() {
      try {
        const data = await getOccupations({
          search: query,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });

        if (!active) return;

        setRequest({
          query,
          page,
          results: data,
          loading: false,
          error: '',
        });
      } catch {
        if (!active) return;

        setRequest({
          query,
          page,
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
  }, [query, page]);

  const loading =
    request.loading || search !== query || request.query !== query || request.page !== page;

  const { results, error } = request;

  const hasNextPage = results.length === PAGE_SIZE;

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

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
        onChange={handleSearchChange}
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
          <p className="result-count">
            Page {page}, showing {results.length} occupations
          </p>

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

          {results.length === 0 && <p>No occupations found on this page.</p>}

          <nav className="pagination" aria-label="Occupation pages">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
