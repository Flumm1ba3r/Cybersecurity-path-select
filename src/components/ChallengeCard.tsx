import type { Week } from '../data/types';
import { getLinkStatus } from '../lib/linkStatus';
import { Icon } from './Icon';
import { ExtLink, LinkStatusBadge, LinkStatusNote } from './ui';

export function ChallengeCard({ week }: { week: Week }) {
  const c = week.challenge;
  const s = getLinkStatus(c.url);
  const facts: string[] = [];
  if (s.difficulty) facts.push(`Platform difficulty: ${s.difficulty[0].toUpperCase()}${s.difficulty.slice(1)}`);
  if (s.premium) facts.push('Marked premium');
  if (s.retired) facts.push('Retired lab');

  return (
    <article className="challenge-card" aria-labelledby={`${week.id}-challenge`}>
      <div className="challenge-head">
        <span className="tag tag-challenge">
          <Icon name="flag" size={14} /> Challenge
        </span>
        <LinkStatusBadge url={c.url} />
      </div>
      <p className="kicker">{c.platform}</p>
      <h3 id={`${week.id}-challenge`} className="challenge-title">
        {c.title}
      </h3>
      <p>{c.description}</p>

      {facts.length > 0 && (
        <ul className="fact-chips" aria-label="Platform details from the last link check">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      <dl className="challenge-dl">
        <div>
          <dt>
            <Icon name="lock" size={14} /> Access
          </dt>
          <dd>
            {c.accessNote} <span className="muted">Access can change, so check before you pay.</span>
          </dd>
        </div>
      </dl>
      <LinkStatusNote url={c.url} />

      <div className="challenge-actions">
        <ExtLink href={c.url} className="btn btn-primary">
          Open challenge
        </ExtLink>
        {c.related?.map((r) => (
          <ExtLink key={r.url} href={r.url} className="btn btn-ghost">
            {r.title}
          </ExtLink>
        ))}
      </div>
      {c.related?.map((r) => (
        <LinkStatusNote key={r.url} url={r.url} />
      ))}
    </article>
  );
}

export function WalkthroughList({ week }: { week: Week }) {
  return (
    <ul className="walk-list">
      {week.walkthroughs.map((w) => (
        <li key={w.url} className="walk-item">
          <div className="walk-main">
            <span className="tag tag-walk">
              <Icon name="book" size={14} /> {w.type}
            </span>
            <ExtLink href={w.url} className="walk-link">
              {w.title}
            </ExtLink>
            <span className="muted small">{w.source}</span>
          </div>
          <LinkStatusBadge url={w.url} />
          <div className="walk-note">
            <LinkStatusNote url={w.url} />
          </div>
        </li>
      ))}
    </ul>
  );
}
