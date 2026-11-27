import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { weeks, programmeMeta } from '../data/programme';
import { useProgress } from '../hooks/useProgress';
import { nextTask, overallProgress, weekProgress } from '../lib/progress';
import { Icon } from './Icon';
import { weekIcon } from './weekIcon';
import { ProgressRing } from './ui';

function Brand() {
  return (
    <NavLink to="/" className="brand" aria-label={`${programmeMeta.title}, dashboard`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M16 4l10 3.8v7.4c0 6-4.1 10.7-10 12.8C10.1 25.9 6 21.2 6 15.2V7.8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="16" cy="15" r="3.4" fill="none" stroke="var(--violet)" strokeWidth="2" />
          <path d="M18.5 17.5l3 3" stroke="var(--violet)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="brand-text">
        Cybersecurity
        <br />
        <strong>Field Notes</strong>
      </span>
    </NavLink>
  );
}

function Sidebar() {
  const { state } = useProgress();
  const overall = overallProgress(state);
  const current = nextTask(state)?.week.id;
  return (
    <aside className="sidebar" aria-label="Primary">
      <Brand />
      <nav className="side-nav">
        <NavLink to="/" end className="side-link">
          <Icon name="home" /> Dashboard
        </NavLink>
        <p className="side-label">Programme</p>
        {weeks.map((w) => {
          const p = weekProgress(state, w);
          return (
            <NavLink key={w.id} to={`/week/${w.number}`} className={`side-link accent-${w.accent}`}>
              <Icon name={weekIcon[w.id]} />
              <span className="side-week">
                <span className="side-week-n">Week {w.number}</span>
                <span className="side-week-t">{w.shortTitle}</span>
              </span>
              {p.pct === 100 ? (
                <Icon name="check" size={16} className="side-done" aria-label="complete" />
              ) : current === w.id ? (
                <span className="side-dot" title="Current week">
                  <span className="sr-only">current week</span>
                </span>
              ) : null}
            </NavLink>
          );
        })}
        <p className="side-label">Decide</p>
        <NavLink to="/reflection" className="side-link">
          <Icon name="compass" /> Career Reflection
        </NavLink>
        <NavLink to="/about" className="side-link">
          <Icon name="info" /> About &amp; Settings
        </NavLink>
      </nav>
      <div className="side-progress">
        <ProgressRing pct={overall.pct} size={52} stroke={5} label={`Programme ${overall.pct}% complete`} />
        <div>
          <p className="kicker">Programme</p>
          <p className="small">
            {overall.done} of {overall.total} tasks
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { state } = useProgress();
  const loc = useLocation();
  const weekActive = loc.pathname.startsWith('/week');
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="mobile-top">
        <Brand />
      </header>
      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div id="week-sheet" className="sheet" role="dialog" aria-modal="true" aria-label="Choose a week" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <p className="kicker">Programme weeks</p>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close week menu">
                <Icon name="x" />
              </button>
            </div>
            {weeks.map((w) => {
              const p = weekProgress(state, w);
              return (
                <NavLink key={w.id} to={`/week/${w.number}`} className={`sheet-link accent-${w.accent}`} onClick={() => setOpen(false)}>
                  <span className="week-icon">
                    <Icon name={weekIcon[w.id]} />
                  </span>
                  <span>
                    <span className="kicker">Week {w.number}</span>
                    <span className="sheet-title">{w.shortTitle}</span>
                  </span>
                  <span className="sheet-pct">{p.pct}%</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
      <nav className="bottom-nav" aria-label="Primary">
        <NavLink to="/" end>
          <Icon name="home" size={20} />
          <span>Home</span>
        </NavLink>
        <button
          type="button"
          className={weekActive ? 'active' : ''}
          aria-expanded={open}
          aria-controls="week-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="layers" size={20} />
          <span>Weeks</span>
        </button>
        <NavLink to="/reflection">
          <Icon name="compass" size={20} />
          <span>Reflect</span>
        </NavLink>
        <NavLink to="/about">
          <Icon name="info" size={20} />
          <span>About</span>
        </NavLink>
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { storageOk } = useProgress();
  const firstRender = useRef(true);
  useEffect(() => {
    // On in-app navigation, reset scroll and move focus to the new page content
    // (but not on first load, so the skip link stays the first Tab stop).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!loc.search.includes('day=') && !loc.search.includes('section=')) window.scrollTo({ top: 0 });
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [loc.pathname, loc.search]);

  return (
    <div className="shell">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <Sidebar />
      <MobileNav />
      <main id="main" tabIndex={-1} className="main">
        {!storageOk && (
          <div className="storage-warn" role="alert">
            Your browser blocked local storage, so progress won’t be saved in this session.
          </div>
        )}
        {children}
        <footer className="footer">
          <p>
            {programmeMeta.title}. Progress is stored only in this browser. External resources belong to their respective owners.
          </p>
        </footer>
      </main>
    </div>
  );
}
