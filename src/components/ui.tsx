import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { getLinkStatus, linksCheckedOn, formatDate, statusLabel, type LinkStatus } from '../lib/linkStatus';

/* ---------- External link ---------- */
export function ExtLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <Icon name="external" size={14} className="ext-icon" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/* ---------- Progress ring ---------- */
export function ProgressRing({
  pct,
  size = 64,
  stroke = 6,
  label,
  tone = 'accent',
}: {
  pct: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: 'accent' | 'success';
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const t = pct >= 100 ? 'success' : tone;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label ?? `${pct}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={`ring-value ring-${t}`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring-label" aria-hidden="true">
        {pct}
        <small>%</small>
      </span>
    </div>
  );
}

export function ProgressBar({ pct, label, small }: { pct: number; label: string; small?: boolean }) {
  return (
    <div
      className={`bar ${small ? 'bar-sm' : ''} ${pct >= 100 ? 'bar-done' : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Notices ---------- */
export function Notice({
  tone = 'info',
  icon,
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'danger' | 'success';
  icon?: IconName;
  title?: string;
  children: ReactNode;
}) {
  const defaultIcon: Record<string, IconName> = { info: 'info', warn: 'alert', danger: 'alert', success: 'check' };
  return (
    <div className={`notice notice-${tone}`} role={tone === 'danger' ? 'alert' : undefined}>
      <Icon name={icon ?? defaultIcon[tone]} size={18} className="notice-icon" />
      <div>
        {title && <p className="notice-title">{title}</p>}
        <div className="notice-body">{children}</div>
      </div>
    </div>
  );
}

export function SafetyNotice({ children, title = 'Safety & scope' }: { children: ReactNode; title?: string }) {
  return (
    <Notice tone="warn" icon="shield" title={title}>
      {children}
    </Notice>
  );
}

/* ---------- Link status badge ---------- */
const statusIcon: Record<LinkStatus['status'], IconName> = {
  available: 'check',
  restricted: 'lock',
  unverified: 'lock',
  'no-embed': 'alert',
  unavailable: 'alert',
  unchecked: 'info',
};

export function LinkStatusBadge({ url, compact }: { url: string; compact?: boolean }) {
  const s = getLinkStatus(url);
  const tip = `${statusLabel[s.status]}${s.note ? ` – ${s.note}` : ''} (checked ${formatDate(linksCheckedOn)})`;
  return (
    <span className={`status status-${s.status}`} title={tip}>
      <Icon name={statusIcon[s.status]} size={13} />
      {!compact && statusLabel[s.status]}
      {compact && <span className="sr-only">{statusLabel[s.status]}</span>}
    </span>
  );
}

/** Inline explanation shown under a resource when its status needs attention. */
export function LinkStatusNote({ url }: { url: string }) {
  const s = getLinkStatus(url);
  if (s.status === 'available' && !s.redirectsTo) return null;
  const tone = s.status === 'unavailable' ? 'danger' : s.status === 'available' ? 'info' : 'warn';
  return (
    <p className={`status-note status-note-${tone}`}>
      <strong>{s.status === 'available' ? 'Note' : statusLabel[s.status]}:</strong> {s.note ?? 'Status unknown.'}{' '}
      <span className="muted">Checked {formatDate(linksCheckedOn)}; access can change.</span>
    </p>
  );
}

/* ---------- Score input (1–5) ---------- */
export function ScoreInput({
  name,
  label,
  value,
  onChange,
  lowLabel = 'Not at all',
  highLabel = 'Very much',
}: {
  name: string;
  label: string;
  value: number | undefined;
  onChange: (v: number | null) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <fieldset className="score">
      <legend>{label}</legend>
      <div className="score-row">
        <span className="score-hint" aria-hidden="true">
          {lowLabel}
        </span>
        <div className="score-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`score-opt ${value === n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => onChange(n)}
                onClick={() => value === n && onChange(null)}
              />
              <span aria-hidden="true">{n}</span>
              <span className="sr-only">
                {n} of 5{n === 1 ? ` (${lowLabel})` : n === 5 ? ` (${highLabel})` : ''}
              </span>
            </label>
          ))}
        </div>
        <span className="score-hint" aria-hidden="true">
          {highLabel}
        </span>
      </div>
    </fieldset>
  );
}

export function SectionHeader({ icon, title, kicker, id }: { icon: IconName; title: string; kicker?: string; id?: string }) {
  return (
    <div className="section-head">
      <span className="section-icon">
        <Icon name={icon} size={18} />
      </span>
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id}>{title}</h2>
      </div>
    </div>
  );
}
