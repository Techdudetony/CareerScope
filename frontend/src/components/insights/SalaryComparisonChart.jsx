import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatCurrency } from '../../utils/formatters';
import { prepareSalaryComparison } from '../../utils/salaryComparison';
import './SalaryComparisonChart.css';

function SalaryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const occupation = payload[0].payload;

  return (
    <div className="salary-chart-tooltip">
      <strong>{occupation.title}</strong>
      <span>National median annual wage</span>
      <b>{formatCurrency(occupation.salary)}</b>
    </div>
  );
}

export default function SalaryComparisonChart({ occupations = [] }) {
  const reducedMotion = useReducedMotion();

  const data = useMemo(() => prepareSalaryComparison(occupations), [occupations]);

  if (data.length === 0) {
    return (
      <section className="salary-chart-section" aria-labelledby="salary-chart-heading">
        <h2 id="salary-chart-heading">Salary comparison</h2>
        <p>No comparable salary data is available.</p>
      </section>
    );
  }

  return (
    <section className="salary-chart-section" aria-labelledby="salary-chart-heading">
      <div className="salary-chart-heading">
        <div>
          <span className="eyebrow">Salary intelligence</span>

          <h2 id="salary-chart-heading">
            <BarChart3 size={25} aria-hidden="true" />
            Compare earning potential
          </h2>

          <p>National median annual wages for the featured top-paying occupations.</p>
        </div>

        <span className="salary-chart-year">BLS OEWS 2025</span>
      </div>

      <motion.div
        className="salary-chart-card"
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
        }}
      >
        <div
          className="salary-chart-visual"
          role="img"
          aria-label="Horizontal bar chart comparing national median annual salaries. Exact values are listed in the table below."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 12,
                right: 24,
                left: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 5"
                horizontal={false}
                stroke="var(--salary-chart-grid)"
              />

              <XAxis
                type="number"
                domain={[0, 'dataMax']}
                tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                tick={{
                  fill: 'var(--salary-chart-muted)',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="code"
                width={86}
                tick={{
                  fill: 'var(--salary-chart-text)',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<SalaryTooltip />}
                cursor={{
                  fill: 'var(--salary-chart-hover)',
                }}
              />

              <Bar
                dataKey="salary"
                radius={[0, 8, 8, 0]}
                maxBarSize={34}
                fill="var(--salary-chart-secondary)"
                isAnimationActive={!reducedMotion}
                animationDuration={900}
                shape={(props) => {
                  const { x, y, width, height, index } = props;

                  if (
                    !Number.isFinite(x) ||
                    !Number.isFinite(y) ||
                    !Number.isFinite(width) ||
                    !Number.isFinite(height) ||
                    width <= 0 ||
                    height <= 0
                  ) {
                    return null;
                  }

                  return (
                    <path
                      d={`
          M ${x} ${y}
          H ${x + Math.max(0, width - 8)}
          Q ${x + width} ${y} ${x + width} ${y + 8}
          V ${y + height - 8}
          Q ${x + width} ${y + height} ${x + width - 8} ${y + height}
          H ${x}
          Z
        `}
                      fill={
                        index === 0
                          ? 'var(--salary-chart-primary)'
                          : 'var(--salary-chart-secondary)'
                      }
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="salary-chart-table-wrapper">
          <table className="salary-chart-table">
            <caption>National median annual salary comparison, BLS OEWS 2025</caption>

            <thead>
              <tr>
                <th scope="col">Occupation</th>
                <th scope="col">Median annual salary</th>
              </tr>
            </thead>

            <tbody>
              {data.map((occupation) => (
                <tr key={occupation.code}>
                  <td>{occupation.title}</td>
                  <td>{formatCurrency(occupation.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="salary-chart-note">
          Figures represent national median annual wages, not guaranteed earnings. Individual
          salaries vary by location, experience, and employer.
        </p>
      </motion.div>
    </section>
  );
}
