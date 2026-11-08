import { motion, useReducedMotion } from 'motion/react';
import CountUp from './CountUp';

export default function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  numeric = false,
  prefix = '',
  suffix = '',
  status,
  delay = 0,
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className="insight-metric-card"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="insight-metric-header">
        <span className="insight-metric-icon">
          <Icon size={21} aria-hidden="true" />
        </span>

        {status && (
          <span
            className={`insight-metric-status insight-metric-status-${status}`}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="insight-metric-body">
        <p className="insight-metric-label">{label}</p>

        <div className="insight-metric-value">
          {numeric ? <CountUp value={value} prefix={prefix} suffix={suffix} /> : value}
        </div>

        <p className="insight-metric-description">{description}</p>
      </div>
    </motion.article>
  );
}
