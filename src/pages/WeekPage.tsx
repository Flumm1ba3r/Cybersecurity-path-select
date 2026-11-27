import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getWeek, weeks } from '../data/programme';
import { useProgress } from '../hooks/useProgress';
import { daysComplete, nextTaskInWeek, reflectionAverage, weekProgress } from '../lib/progress';
import { Icon } from '../components/Icon';
import { weekIcon } from '../components/weekIcon';
import { ChallengeCard, WalkthroughList } from '../components/ChallengeCard';
import { VideoCard } from '../components/VideoCard';
import { DayCard } from '../components/DayCard';
import { Notice, ProgressRing, SafetyNotice, ScoreInput, SectionHeader } from '../components/ui';
import { NotFoundPage } from './NotFoundPage';

export function WeekPage() {
  const { weekNumber } = useParams();
  const week = getWeek(weekNumber ?? '');
  const [params] = useSearchParams();
  const { state, setLastWeek, setWeekReflection } = useProgress();

  useEffect(() => {
    if (week) setLastWeek(week.id);
  }, [week, setLastWeek]);

  const dayParam = params.get('day');
  useEffect(() => {
    if (!dayParam) return;
    const el = document.getElementById(`day-${dayParam}`);
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    }
  }, [dayParam, weekNumber]);

  if (!week) return <NotFoundPage />;

  const p = weekProgress(state, week);
  const next = nextTaskInWeek(state, week);
  const prev = weeks.find((w) => w.number === week.number - 1);
  const nxt = weeks.find((w) => w.number === week.number + 1);
  const refl = state.weekReflections[week.id] ?? {};
  const answered = Object.keys(refl).length;
  const avg = reflectionAverage(state, week);

  return (
    <article className={`page week-page accent-${week.accent}`}>
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link to="/">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Week {week.number}</span>
      </nav>

      <header className="week-hero">
        <div className="week-hero-main">
          <span className="week-hero-icon">
            <Icon name={weekIcon[week.id]} size={26} />
          </span>
          <div>
            <p className="kicker kicker-accent">Week {week.number} of 5</p>
            <h1>{week.title}</h1>
            <p className="lede">{week.subtitle}</p>
          </div>
        </div>
        <div className="week-hero-side">
          <ProgressRing pct={p.pct} size={76} label={`Week ${week.number} ${p.pct}% complete`} />
          <div>
            <p className="small">
              <strong>{daysComplete(state, week)}</strong>/5 days · <strong>{p.done}</strong>/{p.total} tasks
            </p>
            {next ? (
              <Link to={`?day=${next.day.number}`} className="btn btn-primary btn-sm" replace>
                Next: Day {next.day.number} <Icon name="arrowRight" size={14} />
              </Link>
            ) : (
              <a href="#reflection" className="btn btn-success btn-sm" onClick={(e) => { e.preventDefault(); document.getElementById('reflection')?.scrollIntoView(); }}>
                <Icon name="check" size={14} /> Week complete: reflect
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="scenario" aria-labelledby="scenario-h">
        <div className="scenario-text">
          <p className="kicker" id="scenario-h">
            The job scenario
          </p>
          <p>{week.scenario}</p>
        </div>
        <blockquote className="question">
          <p className="kicker">The central question</p>
          <p className="question-text">{week.centralQuestion}</p>
        </blockquote>
      </section>

      <section aria-labelledby="assign-h" className="block">
        <SectionHeader icon="flag" kicker="Exact practical assignment" title="Challenge & walkthrough" id="assign-h" />
        <div className="assign-grid">
          <ChallengeCard week={week} />
          <div className="panel walk-panel">
            <h3 className="panel-title">
              <Icon name="book" size={16} /> Walkthrough
            </h3>
            <p className="muted small">Try the exercise yourself first. Use the walkthrough to check your reasoning, or when you're stuck.</p>
            <WalkthroughList week={week} />
          </div>
        </div>
      </section>

      <section aria-labelledby="watch-h" className="block">
        <SectionHeader icon="video" kicker="Watch first" title="Practitioner videos" id="watch-h" />
        <div className="video-grid">
          {week.videos.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </div>
      </section>

      <section aria-labelledby="days-h" className="block">
        <SectionHeader icon="calendar" kicker="Day 1 – Day 5" title="Daily schedule" id="days-h" />
        <div className="day-list">
          {week.days.map((d) => (
            <DayCard key={d.id} week={week} day={d} isNext={next?.day.id === d.id} />
          ))}
        </div>
      </section>

      <div className="two-col block">
        <section aria-labelledby="tools-h" className="panel">
          <h2 className="panel-title" id="tools-h">
            <Icon name="tool" size={16} /> Tools &amp; concepts you may encounter
          </h2>
          <ul className="chips">
            {week.toolsAndConcepts.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="deliv-h" className="panel">
          <h2 className="panel-title" id="deliv-h">
            <Icon name="briefcase" size={16} /> Weekly deliverables
          </h2>
          <ol className="deliv-list">
            {week.days.map((d) => (
              <li key={d.id}>
                <span className="kicker">Day {d.number}</span> {d.deliverable}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {week.safety && (
        <div className="block">
          <SafetyNotice>{week.safety}</SafetyNotice>
        </div>
      )}

      <section aria-labelledby="career-h" className="block">
        <Notice tone="info" icon="briefcase" title="Career reality to investigate">
          {week.careerReality}
        </Notice>
      </section>

      <section id="reflection" aria-labelledby="refl-h" className="block panel reflection-panel">
        <div className="panel-head">
          <SectionHeader icon="compass" kicker="Weekly reflection" title="How did this week feel?" id="refl-h" />
          <span className="muted small">
            {answered}/{week.weeklyReflectionQuestions.length} rated{avg !== null && ` · average ${avg.toFixed(1)}`}
          </span>
        </div>
        <p className="muted small">Rate each statement from 1 (not at all) to 5 (very much). Click a selected score again to clear it.</p>
        <div className="score-list">
          {week.weeklyReflectionQuestions.map((q, i) => (
            <ScoreInput
              key={q}
              name={`${week.id}-r${i}`}
              label={q}
              value={refl[i]}
              onChange={(v) => setWeekReflection(week.id, i, v)}
            />
          ))}
        </div>
        <Link to="/reflection" className="text-link">
          Add observations in Career Reflection <Icon name="arrowRight" size={14} />
        </Link>
      </section>

      <nav className="pager" aria-label="Week navigation">
        {prev ? (
          <Link to={`/week/${prev.number}`} className="pager-link">
            <Icon name="arrowLeft" size={16} />
            <span>
              <span className="kicker">Week {prev.number}</span>
              {prev.shortTitle}
            </span>
          </Link>
        ) : (
          <Link to="/" className="pager-link">
            <Icon name="arrowLeft" size={16} />
            <span>
              <span className="kicker">Back</span>Dashboard
            </span>
          </Link>
        )}
        {nxt ? (
          <Link to={`/week/${nxt.number}`} className="pager-link pager-next">
            <span>
              <span className="kicker">Week {nxt.number}</span>
              {nxt.shortTitle}
            </span>
            <Icon name="arrowRight" size={16} />
          </Link>
        ) : (
          <Link to="/reflection" className="pager-link pager-next">
            <span>
              <span className="kicker">Finally</span>Career Reflection
            </span>
            <Icon name="arrowRight" size={16} />
          </Link>
        )}
      </nav>
    </article>
  );
}
