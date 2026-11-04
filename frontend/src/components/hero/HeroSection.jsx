import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

import KineticHeadline from './KineticHeadline';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="career-hero" aria-labelledby="hero-heading">
      <div className="career-hero-content">
        <div className="career-hero-eyebrow">CAREERSCOPE / CAREER INTELLIGENCE</div>

        <div id="hero-heading">
          <KineticHeadline />
        </div>

        <p className="career-hero-description">
          Explore real career opportunities, discover salary insights, and make your next career
          move with confidence.
        </p>

        <div className="career-hero-actions">
          <Link to="/occupations" className="hero-button-primary">
            <Search size={18} aria-hidden="true" />
            Explore occupations
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <a href="#career-insights" className="hero-button-secondary">
            Discover insights
          </a>
        </div>

        <p className="career-hero-source">Powered by U.S. Bureau of Labor Statistics data</p>
      </div>
    </section>
  );
}
