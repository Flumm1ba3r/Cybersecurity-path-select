import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  careerCombinations,
  comparisonGuidance,
  comparisonMetrics,
  finalQuestions,
  weeks,
} from '../data/programme';
import type { Week } from '../data/types';
import { useProgress } from '../hooks/useProgress';
import { comparisonAverage, reflectionAverage, weekProgress } from '../lib/progress';
import { exportReflections } from '../lib/exportImport';
import { Icon } from '../components/Icon';
import { weekIcon } from '../components/weekIcon';
import { Notice, ScoreInput, SectionHeader } from '../components/ui';
import { StoredTextarea } from '../components/StoredTextarea';

function ComparisonChart() {
  const { state } = useProgress();
  const [showTable, setShowTable] = useState(false);
  const hasData = weeks.some((w) => comparisonAverage(state, w) !== null);

  if (!hasData)
    return (
      <div className="empty">
        <Icon name="chart" size={28} />
        <p>Enter at least one score below and the comparison chart will appear here.</p>
      </div>
    );

  return (
    <div className="chart">
      <div className="chart-toolbar">
        <p className="muted small">Scores from 1 to 5. Each row is one discipline and each bar is one criterion.</p>
        <button type="button" className="btn btn-ghost btn-sm" aria-pressed={showTable} onClick={() => setShowTable((s) => !s)}>
          {showTable ? 'Show chart' : 'Show as table'}
        </button>
      </div>
      {showTable ? (
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">Comparison scores by discipline</caption>
            <thead>
              <tr>
                <th scope="col">Discipline</th>
                {comparisonMetrics.map((m) => (
                  <th scope="col" key={m.key}>
                    {m.label}
                  </th>
                ))}
                <th scope="col">Average</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => {
                const e = state.comparison[w.id] ?? {};
                const avg = comparisonAverage(state, w);
                return (
                  <tr key={w.id}>
                    <th scope="row">{w.shortTitle}</th>
                    {comparisonMetrics.map((m) => (
                      <td key={m.key}>{e[m.key] ?? '–'}</td>
                    ))}
                    <td>{avg !== null ? avg.toFixed(1) : '–'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="multiples" role="img" aria-label="Bar chart of comparison scores per discipline. Use 'Show as table' for the exact values.">
          {weeks.map((w) => {
            const e = state.comparison[w.id] ?? {};
            const avg = comparisonAverage(state, w);
            return (
              <div key={w.id} className="multiple">
                <div className="multiple-head">
                  <span className="multiple-name">
                    <Icon name={weekIcon[w.id]} size={14} /> {w.shortTitle}
                  </span>
                  <span className="multiple-avg">{avg !== null ? avg.toFixed(1) : '–'}</span>
                </div>
                {comparisonMetrics.map((m) => {
                  const v = e[m.key];
                  return (
                    <div key={m.key} className="mbar" title={`${w.shortTitle} · ${m.label}: ${v ?? 'not rated'}`}>
                      <span className="mbar-label">{m.label}</span>
                      <span className="mbar-track">
                        <span className="mbar-fill" style={{ width: v ? `${(v / 5) * 100}%` : 0 }} />
                        {[1, 2, 3, 4].map((g) => (
                          <span key={g} className="mbar-grid" style={{ left: `${g * 20}%` }} />
                        ))}
                      </span>
                      <span className="mbar-val">{v ?? '–'}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopSummary() {
  const { state } = useProgress();
  const ranked = weeks
    .map((w) => ({ w, avg: comparisonAverage(state, w) }))
    .filter((x): x is { w: Week; avg: number } => x.avg !== null)
    .sort((a, b) => b.avg - a.avg);
  if (ranked.length === 0) return null;
  const top = ranked.filter((x) => x.avg >= ranked[Math.min(1, ranked.length - 1)].avg).slice(0, 3);
  const topIds = top.slice(0, 2).map((x) => x.w.id);
  const combo = careerCombinations.find((c) => c.weeks.length === 2 && c.weeks.every((id) => topIds.includes(id)));

  return (
    <section className="panel summary" aria-labelledby="sum-h">
      <h2 className="panel-title" id="sum-h">
        <Icon name="sparkle" size={16} /> Your highest-rated disciplines
      </h2>
      <ol className="rank-list">
        {top.map(({ w, avg }) => (
          <li key={w.id} className={`accent-${w.accent}`}>
            <span className="week-icon">
              <Icon name={weekIcon[w.id]} size={16} />
            </span>
            <span className="rank-name">{w.title}</span>
            <span className="rank-val">{avg.toFixed(1)}</span>
          </li>
        ))}
      </ol>
      {ranked.length < weeks.length && <p className="muted small">{weeks.length - ranked.length} discipline(s) not rated yet.</p>}
      {combo && (
        <Notice tone="info" icon="compass" title={`From the plan: ${combo.pair}`}>
          {combo.text}
        </Notice>
      )}
    </section>
  );
}

export function ReflectionPage() {
  const { state, setComparison, setFinalAnswer } = useProgress();

  return (
    <div className="page reflection-page">
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link to="/">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Career Reflection</span>
      </nav>
      <header className="page-head">
        <p className="kicker kicker-accent">End-of-programme comparison</p>
        <h1>Career Reflection</h1>
        <p className="lede">{comparisonGuidance}</p>
      </header>

      <Notice tone="warn" title="A reflection aid, not an aptitude test">
        These scores record how <em>you</em> felt about each discipline. They are not an objective measure of career aptitude. Weigh them together with realistic job opportunities and how willing you are to build deeper skills.
      </Notice>

      <div className="reflect-top block">
        <section className="panel" aria-labelledby="chart-h">
          <h2 className="panel-title" id="chart-h">
            <Icon name="chart" size={16} /> Comparison
          </h2>
          <ComparisonChart />
        </section>
        <div className="reflect-side">
          <TopSummary />
          <section className="panel" aria-labelledby="exp-h">
            <h2 className="panel-title" id="exp-h">
              <Icon name="download" size={16} /> Export reflections
            </h2>
            <p className="muted small">Download your scores, observations and answers.</p>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportReflections(state, 'md')}>
                <Icon name="download" size={14} /> Markdown
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportReflections(state, 'json')}>
                <Icon name="download" size={14} /> JSON
              </button>
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="score-h" className="block">
        <SectionHeader icon="compass" kicker="Scorecard" title="Rate each discipline" id="score-h" />
        <p className="muted small">Rate each discipline from 1 (not appealing) to 5 (very appealing).</p>
        <div className="discipline-list">
          {weeks.map((w) => {
            const e = state.comparison[w.id] ?? {};
            const wAvg = reflectionAverage(state, w);
            const wp = weekProgress(state, w);
            return (
              <article key={w.id} className={`panel discipline accent-${w.accent}`} aria-labelledby={`${w.id}-disc`}>
                <header className="discipline-head">
                  <span className="week-icon">
                    <Icon name={weekIcon[w.id]} size={18} />
                  </span>
                  <div>
                    <p className="kicker">Week {w.number}</p>
                    <h3 id={`${w.id}-disc`}>{w.title}</h3>
                  </div>
                  <div className="discipline-meta small muted">
                    <span>{wp.pct}% tasks</span>
                    <span>Weekly reflection {wAvg !== null ? wAvg.toFixed(1) : '–'}</span>
                    <Link to={`/week/${w.number}`} className="text-link">
                      Open week
                    </Link>
                  </div>
                </header>
                <div className="score-grid">
                  {comparisonMetrics.map((m) => (
                    <ScoreInput
                      key={m.key}
                      name={`${w.id}-${m.key}`}
                      label={m.label}
                      value={e[m.key]}
                      lowLabel="1"
                      highLabel="5"
                      onChange={(v) => setComparison(w.id, { [m.key]: v ?? undefined })}
                    />
                  ))}
                </div>
                <StoredTextarea
                  label="Observations"
                  value={e.notes ?? ''}
                  placeholder="What did you enjoy, dislike or want to explore further?"
                  onSave={(v) => setComparison(w.id, { notes: v })}
                />
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="q-h" className="block">
        <SectionHeader icon="note" kicker="Questions to answer" title="Think it through" id="q-h" />
        <div className="question-list">
          {finalQuestions.map((q, i) => (
            <StoredTextarea key={q} label={`${i + 1}. ${q}`} value={state.finalAnswers[i] ?? ''} onSave={(v) => setFinalAnswer(i, v)} rows={2} />
          ))}
        </div>
      </section>

      <section aria-labelledby="combo-h" className="block">
        <SectionHeader icon="layers" kicker="Career decision guidance" title="Possible combinations" id="combo-h" />
        <ul className="combo-grid">
          {careerCombinations.map((c) => (
            <li key={c.pair} className="panel combo">
              <h3>{c.pair}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
        <p className="muted small">
          These combinations are possibilities, not mandatory career ladders. You can remain a technical specialist; you do not have to move into architecture.
        </p>
      </section>
    </div>
  );
}
