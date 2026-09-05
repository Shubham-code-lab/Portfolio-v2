import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from './contexts/ThemeProvider';
import { CardTransitionProvider } from './contexts/CardTransitionProvider';
import FlyingImageOverlay from './components/FlyingImageOverlay';
import Navbar from './Ui/Navbar';
import Neko from './components/Neko';

/** Lazy-loaded so the project detail bundle is only fetched on first navigation. */
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <CardTransitionProvider>
        <BrowserRouter basename="/Portfolio-v2">
          <Navbar />
          <Neko />
          {/*
            FlyingImageOverlay lives OUTSIDE <Routes> so it is never
            unmounted during navigation — the flying image persists across
            the route change, keeping the illusion seamless.
          */}
          <FlyingImageOverlay />

          <Suspense fallback={null}>
            <Routes>
              <Route path="/"             element={<Navigate to="/home" replace />} />
              <Route path="/home"         element={<Home />} />
              <Route path="/project/:id"  element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CardTransitionProvider>
    </ThemeProvider>
  );
}

export default App;
