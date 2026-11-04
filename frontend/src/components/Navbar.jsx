import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BriefcaseBusiness, ChartColumn, Search, Menu, X } from 'lucide-react';

import ThemeToggle from './ui/ThemeToggle';

const navigation = [
  { to: '/', label: 'Dashboard', icon: ChartColumn, end: true },
  { to: '/occupations', label: 'Occupations', icon: Search },
];

export default function NavBar() {
  const location = useLocation();

  return <NavBarContent key={location.pathname} />;
}

function NavBarContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <NavLink to="/" className="brand" aria-label="CareerScope home" onClick={closeMenu}>
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
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={`mobile-navigation${menuOpen ? ' mobile-navigation--open' : ''}`}
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `mobile-navigation__link${isActive ? ' mobile-navigation__link--active' : ''}`
              }
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
