import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
// import Dashboard from './pages/Dashboard';
import MotionProvider from './components/motion/MotionProvider';
// import Occupations from './pages/Occupations';
// import OccupationDetails from './pages/OccupationDetails';

import './App.css';

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Occupations = lazy(() => import("./pages/Occupations"));
const OccupationDetails = lazy(
  () => import("./pages/OccupationDetails")
);

export default function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <Suspense fallback={<p role='status'>Loading page...</p>}>
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
        </Suspense>
      </BrowserRouter>
    </MotionProvider>
  );
}
