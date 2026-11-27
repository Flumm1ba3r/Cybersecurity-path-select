import { HashRouter, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './hooks/useProgress';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { WeekPage } from './pages/WeekPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** HashRouter keeps every route working on GitHub Pages (no server rewrites needed). */
export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/week/:weekNumber" element={<WeekPage />} />
            <Route path="/reflection" element={<ReflectionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ProgressProvider>
  );
}
