import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Occupations from './pages/Occupations';
import OccupationDetails from './pages/OccupationDetails';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}
