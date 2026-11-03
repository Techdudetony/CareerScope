
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
    hasNextPage: false,
    loading: true,
    error: '',
  });

  // Debounce search input to avoid unnecessary API calls.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch occupations whenever the search or page changes.
  useEffect(() => {
    let active = true;

    async function loadOccupations() {
      try {
        // Fetch one additional record to determine
        // whether another page actually exists.
        const data = await getOccupations({
          search: query,
          limit: PAGE_SIZE + 1,
          offset: (page - 1) * PAGE_SIZE,
        });

        if (!active) return;

        setRequest({
          query,
          page,
          results: data.slice(0, PAGE_SIZE),
          hasNextPage: data.length > PAGE_SIZE,
          loading: false,
          error: '',
        });
      } catch {
        if (!active) return;

        setRequest({
          query,
          page,
          results: [],
          hasNextPage: false,
          loading: false,
          error: 'Could not load occupations. Please try again.',
        });
      }
    }

    loadOccupations();

    return () => {
      active = false;
    };
  }, [query, page]);

  const loading =
    request.loading ||
    search.trim() !== query ||
    request.query !== query ||
    request.page !== page;

  const { results, error, hasNextPage } = request;

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

      {loading && (
        <p role="status">Searching occupations...</p>
      )}

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
                to={`/occupations/${encodeURIComponent(
                  occupation.code
                )}`}
                className="occupation-list-item"
              >
                <span>{occupation.title}</span>
                <small>{occupation.code}</small>
              </Link>
            ))}
          </div>

          {results.length === 0 && (
            <p>No occupations found on this page.</p>
          )}

          {results.length > 0 && (
            <nav
              className="pagination"
              aria-label="Occupation pages"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => current - 1)
                }
              >
                Previous
              </button>

              <span>Page {page}</span>

              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() =>
                  setPage((current) => current + 1)
                }
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
