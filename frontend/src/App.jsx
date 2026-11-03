import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Occupations from './pages/Occupations';
import OccupationDetails from './pages/OccupationDetails';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/occupations" element={<Occupations />} />
          <Route path="/occupations/:code" element={<OccupationDetails />} />
          <Route
            path="*"
            element={
              <main className="container page-content">
                <h1>Page not found</h1>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
