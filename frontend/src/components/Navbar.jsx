import { NavLink } from 'react-router-dom';
import { BriefcaseBusiness, ChartColumn, Search } from 'lucide-react';

export default function NavBar() {
  return (
    <header className='site-header'>
      <div className='container nav-inner'>
        <NavLink to="/" className="brand">
          <BriefcaseBusiness size={25} />
          <span>CareerScope</span>
        </NavLink>

        <nav className='nav-links' aria-label='Main navigation'>
          <NavLink to="/" end>
            <ChartColumn size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/occupations">
            <Search size={18} />
            Occupations
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
