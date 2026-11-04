import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getOccupation } from '../api/occupations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import SalaryChart from '../components/SalaryChart';

export default function OccupationDetails() {
  const { code } = useParams();

  const [request, setRequest] = useState({
    code: null,
    occupation: null,
    error: '',
  });

  useEffect(() => {
    let active = true;

    async function loadOccupation() {
      try {
        const data = await getOccupation(code);

        if (!active) return;

        setRequest({
          code,
          occupation: data ?? null,
          error: data ? '' : 'Occupation not found.',
        });
      } catch {
        if (!active) return;

        setRequest({
          code,
          occupation: null,
          error: 'Occupation not found or API unavailable.',
        });
      }
    }

    loadOccupation();

    return () => {
      active = false;
    };
  }, [code]);

  // Do not render data belonging to a previous route.
  if (request.code !== code) {
    return (
      <main className="container page-content" role="status">
        Loading occupation...
      </main>
    );
  }

  if (request.error || !request.occupation) {
    return (
      <main className="container page-content" role="alert">
        {request.error || 'Occupation not found.'}
      </main>
    );
  }

  const occupation = request.occupation;

  const wage = occupation.wages?.find((item) => item.year === 2025 && item.area_code === '99');

  const metrics = [
    ['Median salary', wage?.annual_median],
    ['Mean salary', wage?.annual_mean],
    ['10th percentile', wage?.annual_p10],
    ['90th percentile', wage?.annual_p90],
  ];

  return (
    <main className="container page-content">
      <Link to="/occupations" className="back-button">
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back to occupations</span>
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
