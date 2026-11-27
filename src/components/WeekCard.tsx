import { Link } from 'react-router-dom';
import type { Week } from '../data/types';
import { useProgress } from '../hooks/useProgress';
import { daysComplete, weekProgress, weekStatus } from '../lib/progress';
import { programmeMeta } from '../data/programme';
import { getLinkStatus } from '../lib/linkStatus';
import { Icon } from './Icon';
import { weekIcon } from './weekIcon';
import { ProgressBar } from './ui';

const statusText = { 'not-started': 'Not started', 'in-progress': 'In progress', complete: 'Complete' };

export function WeekCard({ week, isCurrent }: { week: Week; isCurrent?: boolean }) {
  const { state } = useProgress();
  const p = weekProgress(state, week);
  const st = weekStatus(state, week);
  const access = getLinkStatus(week.challenge.url).status;

  return (
    <Link to={`/week/${week.number}`} className={`week-card accent-${week.accent} ${isCurrent ? 'is-current' : ''}`}>
      <div className="week-card-top">
        <span className="week-icon">
          <Icon name={weekIcon[week.id]} size={20} />
        </span>
        <span className={`state state-${st}`}>{statusText[st]}</span>
      </div>
      <p className="kicker">Week {week.number}</p>
      <h3>{week.shortTitle}</h3>
      <p className="week-card-sub">{week.subtitle}</p>
      <p className="week-card-challenge">
        <Icon name="flag" size={13} /> {week.challenge.platform} · {week.challenge.title}
        {(access === 'restricted' || access === 'unverified') && (
          <span className="week-lock" title="Access may require an account or subscription">
            <Icon name="lock" size={12} />
            <span className="sr-only"> (access may be restricted)</span>
          </span>
        )}
        {access === 'unavailable' && <span className="week-bad"> · unavailable</span>}
      </p>
      <div className="week-card-foot">
        <ProgressBar pct={p.pct} small label={`Week ${week.number} progress`} />
        <div className="week-card-stats">
          <span>{daysComplete(state, week)}/5 days</span>
          <span>
            <Icon name="clock" size={12} /> {programmeMeta.weeklyEffort}
          </span>
        </div>
      </div>
      {isCurrent && <span className="current-flag">Current</span>}
    </Link>
  );
}
