import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOccupation } from '../api/occupations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import SalaryChart from '../components/SalaryChart';

export default function OccupationDetails() {
  const { code } = useParams();
  const [occupation, setOccupation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOccupation() {
      setLoading(true);
      setOccupation(null);
      setError('');

      try {
        const data = await getOccupation(code);
        if (active) setOccupation(data);
      } catch {
        if (active) setError('Occupation not found or API unavailable.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOccupation();

    return () => {
      active = false;
    };
  }, [code]);

  if (loading) {
    return (
      <main className="container page-content" role="status">
        Loading...
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page-content" role="alert">
        {error}
      </main>
    );
  }

  const wage = occupation.wages?.find((item) => item.year === 2025 && item.area_code === '99');

  const metrics = [
    ['Median salary', wage?.annual_median],
    ['Mean salary', wage?.annual_mean],
    ['10th percentile', wage?.annual_p10],
    ['90th percentile', wage?.annual_p90],
  ];

  return (
    <main className="container page-content">
      <Link to="/occupations" className="text-link">
        Back to occupations
      </Link>

      <div className="page-heading">
        <span className="eyebrow">SOC {occupation.code}</span>
        <h1>{occupation.title}</h1>
        <p>National wage estimates for 2025</p>
      </div>

      <div className="stats-grid">
        {metrics.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{formatCurrency(value)}</strong>
          </div>
        ))}
      </div>

      <SalaryChart wage={wage} />

      <section className="section-block">
        <h2>Employment information</h2>
        <p>Estimated employment: {formatNumber(wage?.employment)}</p>
        <p>Source: {wage?.source ?? 'BLS OEWS'}</p>
      </section>
    </main>
  );
}
