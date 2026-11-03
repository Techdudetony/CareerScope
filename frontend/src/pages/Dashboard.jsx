import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp } from 'lucide-react';
import { getTopPayingOccupations, checkApiHealth } from '../api/occupations';
import OccupationCard from '../components/OccupationCard';
import Reveal from '../components/motion/Reveal';

export default function Dashboard() {
  const [occupations, setOccupations] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [health, results] = await Promise.all([checkApiHealth(), getTopPayingOccupations(6)]);

        if (!active) return;

        setApiStatus(health.status === 'ok' ? 'online' : 'offline');
        setOccupations(results);
      } catch {
        if (!active) return;

        setApiStatus('offline');
        setError('Unable to load career data. Check the FastAPI server');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="container page-content">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">BLS OEWS | May 2025</span>

          <Reveal variant='fadeUp'>
            <h1>
              Explore careers.
              <br />
              Understand your earning potential.
            </h1>
          </Reveal>

          <p>
            Discover occupations, compare national salary estimates, and make informed career
            decisions using official labor market data.
          </p>

          <Link to="/occupations" className="primary-button">
            <Search size={18} />
            Explore occupations
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="Dataset information">
        <div className="stat-card">
          <span>Data source</span>
          <strong>BLS</strong>
          <p>Occupational Employment and Wage Statistics</p>
        </div>

        <div className="stat-card">
          <span>Data coverage</span>
          <strong>United States</strong>
          <p>National occupational wage estimates</p>
        </div>

        <div className="stat-card">
          <span>API connection</span>
          <strong className={`status-${apiStatus}`}>
            {apiStatus === 'checking'
              ? 'Checking...'
              : apiStatus === 'online'
                ? 'Connected'
                : 'Unavailable'}
          </strong>
          <p>CareerScope FastAPI backend</p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Career insights</span>
            <h2>
              <TrendingUp size={24} />
              Top-paying occupations
            </h2>
            <p>Ranked by national median annual wage.</p>
          </div>

          <Link to="/occupations" className="text-link">
            Browse occupations <ArrowRight size={16} />
          </Link>
        </div>

        {loading && <p role="status">Loading occupation data...</p>}

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && occupations.length === 0 && <p>No occupation data is available.</p>}

        {!loading && !error && occupations.length > 0 && (
          <div className="occupation-grid">
            {occupations.map((occupation) => (
              <OccupationCard key={occupation.code} occupation={occupation} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
