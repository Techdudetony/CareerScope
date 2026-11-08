import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getTopPayingOccupations, checkApiHealth } from '../api/occupations';
import OccupationCard from '../components/OccupationCard';
import HeroSection from '../components/hero/HeroSection';
import InsightsOverview from '../components/insights/InsightsOverview';

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
      <HeroSection />

      <InsightsOverview apiStatus={apiStatus} />

      <section className="section-block" id="career-insights">
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
