
import { NavLink } from 'react-router-dom';
import { BriefcaseBusiness, ChartColumn, Search } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const navigation = [
  {
    to: '/',
    label: 'Dashboard',
    icon: ChartColumn,
    end: true,
  },
  {
    to: '/occupations',
    label: 'Occupations',
    icon: Search,
    end: false,
  },
];

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <NavLink to="/" className="brand" aria-label="CareerScope home">
          <span className="brand__icon" aria-hidden="true">
            <BriefcaseBusiness size={22} />
          </span>
          <span>CareerScope</span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
