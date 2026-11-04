import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

import KineticHeadline from './KineticHeadline';
import MagneticButton from './MagneticButton';
import ParticleField from './ParticleField';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="career-hero" aria-labelledby="hero-heading">
      <ParticleField />

      <div className="career-hero-content">
        <div className="career-hero-eyebrow">CAREERSCOPE / CAREER INTELLIGENCE</div>

        <KineticHeadline />

        <p className="career-hero-description">
          Explore real career opportunities, discover salary insights, and make your next career
          move with confidence.
        </p>

        <div className="career-hero-actions">
          <MagneticButton>
            <Link to="/occupations" className="hero-button-primary">
              <Search size={18} aria-hidden="true" />
              Explore occupations
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.12}>
            <a href="#career-insights" className="hero-button-secondary">
              Discover insights
            </a>
          </MagneticButton>
        </div>

        <p className="career-hero-source">Powered by U.S. Bureau of Labor Statistics data</p>
      </div>
    </section>
  );
}
