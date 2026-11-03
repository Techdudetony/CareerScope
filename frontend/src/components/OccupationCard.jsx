import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function OccupationCard({ occupation }) {
  const wage = occupation.wages?.find((item) => item.year === 2025 && item.area_code === '99');

  return (
    <Link to={`/occupations/${encodeURIComponent(occupation.code)}`} className="occupation-card">
      <div>
        <span className="occupation-code">{occupation.code}</span>
        <h3>{occupation.title}</h3>
        <p>National median annual salary</p>
        <strong>{formatCurrency(wage?.annual_median)}</strong>
      </div>

      <ArrowUpRight size={20} aria-hidden="true" />
    </Link>
  );
}
