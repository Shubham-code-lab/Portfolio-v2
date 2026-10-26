import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import Home from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from './contexts/ThemeProvider';
import { CardTransitionProvider } from './contexts/CardTransitionProvider';
import FlyingImageOverlay from './components/FlyingImageOverlay';
import Navbar from './Ui/Navbar';
import Neko from './components/Neko';
import ContextCursor from './components/ContextCursor';

/** Lazy-loaded so the project detail bundle is only fetched on first navigation. */
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <ReactLenis
        root
        options={{
          autoRaf: true,
          duration: 1.15,
          wheelMultiplier: 0.72,
          touchMultiplier: 0.9,
        }}
      >
        <CardTransitionProvider>
          <BrowserRouter basename="/Portfolio-v2">
            <Navbar />
            <Neko />
            <ContextCursor />
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
      </ReactLenis>
    </ThemeProvider>
  );
}

export default App;
