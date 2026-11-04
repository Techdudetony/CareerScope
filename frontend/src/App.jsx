import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import MotionProvider from './components/motion/MotionProvider';

import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Occupations = lazy(() => import('./pages/Occupations'));
const OccupationDetails = lazy(() => import('./pages/OccupationDetails'));

function PageLoader() {
  return (
    <div className="container page-content" role="status">
      Loading page...
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route
              path="/"
              element={
                <LazyPage>
                  <Dashboard />
                </LazyPage>
              }
            />
            <Route
              path="/occupations"
              element={
                <LazyPage>
                  <Occupations />
                </LazyPage>
              }
            />
            <Route
              path="/occupations/:code"
              element={
                <LazyPage>
                  <OccupationDetails />
                </LazyPage>
              }
            />
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
    </MotionProvider>
  );
}
