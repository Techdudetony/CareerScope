import { Link } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatCurrency } from '../utils/formatters';
import './OccupationCard.css';

export default function OccupationCard({ occupation }) {
  const reducedMotion = useReducedMotion();

  const wage = occupation.wages?.find((item) => item.year === 2025 && item.area_code === '99');

  const salary = formatCurrency(wage?.annual_median);

  return (
    <motion.article
      className="career-card"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { y: -5 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/occupations/${encodeURIComponent(occupation.code)}`} className="career-card-link">
        <div className="career-card-top">
          <span className="career-card-icon">
            <BriefcaseBusiness size={21} aria-hidden="true" />
          </span>

          <span className="career-card-arrow">
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </div>

        <div className="career-card-content">
          <span className="career-card-code">OCC {occupation.code}</span>

          <h3 className="career-card-title">{occupation.title}</h3>
        </div>

        <div className="career-card-footer">
          <div className="career-card-salary-label">
            <TrendingUp size={15} aria-hidden="true" />
            <span>National median annual salary</span>
          </div>

          <strong className="career-card-salary">{salary}</strong>

          <span className="career-card-source">BLS OWES · 2025</span>
        </div>
      </Link>
    </motion.article>
  );
}
