import { Link } from 'react-router-dom';
import { programmeMeta, weeks } from '../data/programme';
import { useProgress } from '../hooks/useProgress';
import { explorationScore, nextTask, overallProgress, weekProgress, daysComplete } from '../lib/progress';
import { getLinkStatus } from '../lib/linkStatus';
import { Icon } from '../components/Icon';
import { weekIcon } from '../components/weekIcon';
import { WeekCard } from '../components/WeekCard';
import { ExtLink, LinkStatusBadge, ProgressRing, SafetyNotice } from '../components/ui';

export function DashboardPage() {
  const { state } = useProgress();
  const overall = overallProgress(state);
  const next = nextTask(state);
  const started = overall.done > 0;
  const firstVideo = next?.week.videos[0];
  const scores = weeks.map((w) => ({ w, s: explorationScore(state, w) }));
  const anyScore = scores.some((x) => x.s);
  const completeDays = weeks.reduce((n, w) => n + daysComplete(state, w), 0);

  return (
    <div className="page dashboard">
      <header className="dash-head">
        <div>
          <p className="kicker kicker-accent">Career exploration programme</p>
          <h1>{programmeMeta.title}</h1>
          <p className="lede">{programmeMeta.subtitle}</p>
        </div>
        <div className="dash-overall">
          <ProgressRing pct={overall.pct} size={84} stroke={7} label={`Programme ${overall.pct}% complete`} />
          <dl>
            <div>
              <dt>Tasks</dt>
              <dd>
                {overall.done}/{overall.total}
              </dd>
            </div>
            <div>
              <dt>Days</dt>
              <dd>{completeDays}/25</dd>
            </div>
            <div>
              <dt>Weekly effort</dt>
              <dd>{programmeMeta.weeklyEffort.replace(' per week', '')}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="dash-grid">
        {next ? (
          <section className={`mission accent-${next.week.accent}`} aria-labelledby="mission-h">
            <div className="mission-glow" aria-hidden="true" />
            <p className="kicker kicker-accent">
              <Icon name="sparkle" size={14} /> {started ? 'Continue where you left off' : 'Today’s mission'}
            </p>
            <h2 id="mission-h">
              Week {next.week.number}, Day {next.day.number}: {next.day.title}
            </h2>
            <p className="mission-week">
              <Icon name={weekIcon[next.week.id]} size={15} /> {next.week.title}
            </p>
            <div className="mission-task">
              <span className="kicker">Next task</span>
              <p>{next.day.tasks[next.taskIndex].text}</p>
              <ProgressBar2 done={weekProgress(state, next.week).pct} />
            </div>
            <div className="mission-links">
              {firstVideo && (
                <div className="mission-link">
                  <Icon name="video" size={16} />
                  <div>
                    <span className="kicker">Watch</span>
                    <ExtLink href={firstVideo.url}>{firstVideo.title}</ExtLink>
                  </div>
                  <LinkStatusBadge url={firstVideo.url} compact />
                </div>
              )}
              <div className="mission-link">
                <Icon name="flag" size={16} />
                <div>
                  <span className="kicker">Challenge</span>
                  <ExtLink href={next.week.challenge.url}>
                    {next.week.challenge.platform}: {next.week.challenge.title}
                  </ExtLink>
                </div>
                <LinkStatusBadge url={next.week.challenge.url} compact />
              </div>
            </div>
            <Link to={`/week/${next.week.number}?day=${next.day.number}`} className="btn btn-primary">
              {started ? 'Continue' : 'Start'} Day {next.day.number} <Icon name="arrowRight" size={16} />
            </Link>
          </section>
        ) : (
          <section className="mission mission-done" aria-labelledby="mission-h">
            <p className="kicker kicker-success">
              <Icon name="check" size={14} /> Programme complete
            </p>
            <h2 id="mission-h">All 25 days done. Time to decide.</h2>
            <p>Compare the five disciplines side by side and write down what you learned.</p>
            <Link to="/reflection" className="btn btn-primary">
              Open career reflection <Icon name="arrowRight" size={16} />
            </Link>
          </section>
        )}

        <section className="panel explore" aria-labelledby="explore-h">
          <div className="panel-head">
            <h2 id="explore-h">Your exploration</h2>
            <Link to="/reflection" className="text-link">
              Reflect <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          {anyScore ? (
            <ul className="explore-list">
              {scores.map(({ w, s }) => (
                <li key={w.id}>
                  <span className="explore-name">{w.shortTitle}</span>
                  <span className="explore-bar" aria-hidden="true">
                    <span style={{ width: s ? `${(s.value / 5) * 100}%` : 0 }} />
                  </span>
                  <span className="explore-val">{s ? s.value.toFixed(1) : '–'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <Icon name="chart" size={26} />
              <p>No scores yet. Rate each week at the end of Day 5 and your scores will build up here.</p>
            </div>
          )}
          {anyScore && <p className="muted small">Average score (1–5). Comparison scores are used where you’ve entered them, otherwise weekly reflection scores.</p>}
        </section>
      </div>

      <section aria-labelledby="weeks-h" className="weeks-section">
        <div className="panel-head">
          <h2 id="weeks-h">Five weeks, five disciplines</h2>
          <span className="muted small">Target {programmeMeta.dayTargetTime} per day</span>
        </div>
        <div className="week-grid">
          {weeks.map((w) => (
            <WeekCard key={w.id} week={w} isCurrent={next?.week.id === w.id} />
          ))}
        </div>
      </section>

      <div className="dash-notes">
        <SafetyNotice title="Safety & access">
          <ul className="tight">
            <li>Run malware exercises only in the official lab environment or an isolated VM, never on your everyday computer or a production network.</li>
            <li>Only attack the Hack The Box machine while it is assigned to you and within the platform’s rules.</li>
            <li>
              {weeks.filter((w) => ['restricted', 'unverified'].includes(getLinkStatus(w.challenge.url).status)).length} of 5 challenges
              may need an account or subscription. Check each official page before paying.{' '}
              <Link to="/about?section=links" className="text-link">
                See link status
              </Link>
            </li>
          </ul>
        </SafetyNotice>
      </div>
    </div>
  );
}

function ProgressBar2({ done }: { done: number }) {
  return (
    <div className="mission-progress">
      <span className="bar bar-sm" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={100} aria-label="Week progress">
        <span style={{ width: `${done}%` }} />
      </span>
      <span className="small muted">{done}% of week</span>
    </div>
  );
}
