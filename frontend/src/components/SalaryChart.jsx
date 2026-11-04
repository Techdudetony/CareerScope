import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatCurrency } from '../utils/formatters';

export default function SalaryChart({ wage }) {
  if (!wage) {
    return <p>Salary data is unavailable.</p>;
  }

  const data = [
    { name: '10th percentile', salary: Number(wage.annual_p10) },
    { name: 'Median', salary: Number(wage.annual_median) },
    { name: 'Mean', salary: Number(wage.annual_mean) },
    { name: '90th percentile', salary: Number(wage.annual_p90) },
  ].filter((item) => Number.isFinite(item.salary) && item.salary > 0);

  if (data.length === 0) {
    return <p>No salary estimates are available.</p>;
  }

  return (
    <section className="salary-chart-section">
      <h2>Annual wage estimates</h2>
      <p>Annual wage estimates from BLS OEWS</p>

      <div className="salary-chart">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 35, left: 25, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
            <YAxis dataKey="name" type="category" width={110} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="salary" name="Annual wage" fill="#315fba" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
