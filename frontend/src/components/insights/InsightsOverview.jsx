import { Activity, Database, MapPinned } from 'lucide-react';
import MetricCard from './MetricCard';
import './InsightsOverview.css';

export default function InsightsOverview({ apiStatus }) {
  const connectionLabel =
    apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Connected' : 'Unavailable';

  const connectionDescription =
    apiStatus === 'online'
      ? 'CareerScope backend is responding'
      : apiStatus === 'checking'
        ? 'Checking backend availability'
        : 'Career data service is unavailable';

  return (
    <section className="insights-overview" aria-labelledby="insights-overview-heading">
      <div className="insights-overview-heading">
        <span className="eyebrow">Data intelligence</span>

        <h2 id="insights-overview-heading">Explore the data behind your next move.</h2>

        <p>Reliable labor market information to help you explore careers with confidence.</p>
      </div>

      <div className="insights-metric-grid">
        <MetricCard
          icon={Database}
          label="Data source"
          value="BLS"
          description="Occupational Employment and Wage Statistics"
          delay={0}
        />

        <MetricCard
          icon={MapPinned}
          label="Data coverage"
          value="United States"
          description="National occupational wage estimates"
          delay={0.1}
        />

        <MetricCard
          icon={Activity}
          label="API connection"
          value={connectionLabel}
          description={connectionDescription}
          status={apiStatus}
          delay={0.2}
        />
      </div>
    </section>
  );
}
