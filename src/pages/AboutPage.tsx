import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { linksNote, programmeMeta, safetyRules, setupChecklist, weeklyRhythm, weeks } from '../data/programme';
import { useProgress } from '../hooks/useProgress';
import { exportBackup, readBackupFile } from '../lib/exportImport';
import { allLinkStatuses, formatDate, linksCheckedOn, statusLabel } from '../lib/linkStatus';
import { Icon } from '../components/Icon';
import { ExtLink, LinkStatusBadge, Notice, SectionHeader } from '../components/ui';

function resourceName(url: string): string {
  for (const w of weeks) {
    if (w.challenge.url === url) return `Week ${w.number} challenge · ${w.challenge.title}`;
    const v = w.videos.find((x) => x.url === url);
    if (v) return `Week ${w.number} video · ${v.title}`;
    const wt = w.walkthroughs.find((x) => x.url === url);
    if (wt) return `Week ${w.number} walkthrough · ${wt.title}`;
    const r = w.challenge.related?.find((x) => x.url === url);
    if (r) return `Week ${w.number} · ${r.title}`;
  }
  const s = setupChecklist.find((x) => x.link.url === url);
  return s ? `Setup · ${s.link.title}` : url;
}

export function AboutPage() {
  const { state, replaceAll, reset } = useProgress();
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [params] = useSearchParams();
  const links = allLinkStatuses();
  const attention = links.filter((l) => l.status !== 'available');

  useEffect(() => {
    const section = params.get('section');
    if (section) document.getElementById(section)?.scrollIntoView();
  }, [params]);

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    const res = await readBackupFile(file);
    if (fileRef.current) fileRef.current.value = '';
    if (!res.ok) {
      setMsg({ tone: 'danger', text: `Import failed: ${res.error} Your current progress was not changed.` });
      return;
    }
    if (!window.confirm('Replace your current progress with this backup? This cannot be undone. Export a backup first if you want to keep your current progress.')) return;
    replaceAll(res.state);
    setMsg({ tone: 'success', text: `Backup imported: ${Object.keys(res.state.tasks).length} completed tasks restored.` });
  };

  return (
    <div className="page about-page">
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link to="/">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">About &amp; Settings</span>
      </nav>
      <header className="page-head">
        <p className="kicker kicker-accent">About the programme</p>
        <h1>About &amp; Settings</h1>
        <p className="lede">{programmeMeta.purpose}</p>
      </header>

      <div className="two-col block">
        <section className="panel" aria-labelledby="fmt-h">
          <h2 className="panel-title" id="fmt-h">
            <Icon name="layers" size={16} /> Format
          </h2>
          <p>{programmeMeta.format}</p>
          <p className="muted">{programmeMeta.commitment}</p>
          <Notice tone="info" title="Important">
            {programmeMeta.important}
          </Notice>
        </section>
        <section className="panel" aria-labelledby="rh-h">
          <h2 className="panel-title" id="rh-h">
            <Icon name="calendar" size={16} /> Weekly rhythm
          </h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Activity</th>
                  <th scope="col">Target time</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRhythm.map((r) => (
                  <tr key={r.day}>
                    <th scope="row">{r.day}</th>
                    <td>{r.activity}</td>
                    <td className="nowrap">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="block" aria-labelledby="setup-h">
        <SectionHeader icon="tool" kicker="Before starting" title="Accounts, tools & safety" id="setup-h" />
        <div className="two-col">
          <ul className="setup-list panel">
            {setupChecklist.map((s) => (
              <li key={s.link.url}>
                <p>{s.text}</p>
                <div className="setup-link">
                  <ExtLink href={s.link.url}>{s.link.title}</ExtLink>
                  <LinkStatusBadge url={s.link.url} />
                </div>
              </li>
            ))}
          </ul>
          <div className="stack">
            {safetyRules.map((r) => (
              <Notice key={r} tone="warn" icon="shield">
                {r}
              </Notice>
            ))}
          </div>
        </div>
      </section>

      <section id="links" className="block" aria-labelledby="links-h">
        <SectionHeader icon="external" kicker={`Last checked ${formatDate(linksCheckedOn)}`} title="Resource & link status" id="links-h" />
        <p className="muted">
          Every external link was checked automatically. YouTube videos were checked for being public and embeddable, and pages for loading with the expected content. {attention.length} of {links.length} resources need attention, usually because the platform needs an account or subscription. {linksNote}
        </p>
        <div className="legend">
          {(['available', 'restricted', 'unverified', 'no-embed', 'unavailable', 'unchecked'] as const).map((k) => (
            <span key={k} className={`status status-${k}`}>
              {statusLabel[k]}
            </span>
          ))}
        </div>
        <div className="table-wrap">
          <table className="data-table link-table">
            <thead>
              <tr>
                <th scope="col">Resource</th>
                <th scope="col">Status</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.url} className={l.status === 'unavailable' ? 'row-bad' : ''}>
                  <th scope="row">
                    <ExtLink href={l.url}>{resourceName(l.url)}</ExtLink>
                  </th>
                  <td>
                    <LinkStatusBadge url={l.url} />
                  </td>
                  <td className="small">{l.note ?? (l.httpStatus ? `HTTP ${l.httpStatus}` : '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="data" className="block" aria-labelledby="data-h">
        <SectionHeader icon="lock" kicker="Privacy & backup" title="Your progress data" id="data-h" />
        <Notice tone="info" icon="lock" title="Stored only in this browser">
          Your progress, notes and scores are saved in this browser’s local storage on this device. Nothing is sent to a server, and there is no account or login. Progress is <strong>not</strong> synced between devices or browsers, and clearing site data deletes it. Use a backup to move progress or keep it safe. Don’t store passwords or sensitive personal data in your notes.
        </Notice>

        {msg && (
          <div className="block-sm">
            <Notice tone={msg.tone}>{msg.text}</Notice>
          </div>
        )}

        <div className="data-actions">
          <div className="panel">
            <h3 className="panel-title">
              <Icon name="download" size={16} /> Export backup
            </h3>
            <p className="muted small">Download all progress, notes and scores as a JSON file.</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => exportBackup(state)}>
              <Icon name="download" size={14} /> Export JSON backup
            </button>
          </div>
          <div className="panel">
            <h3 className="panel-title">
              <Icon name="upload" size={16} /> Import backup
            </h3>
            <p className="muted small">Restore from a backup file. The file is checked before anything is replaced.</p>
            <label className="btn btn-ghost btn-sm file-btn">
              <Icon name="upload" size={14} /> Choose backup file…
              <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onImport(e.target.files?.[0])} />
            </label>
          </div>
          <div className="panel danger-panel">
            <h3 className="panel-title">
              <Icon name="trash" size={16} /> Reset my progress
            </h3>
            <p className="muted small">Permanently delete all progress, notes and scores from this browser.</p>
            {confirmReset ? (
              <div className="btn-row" role="group" aria-label="Confirm reset">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    reset();
                    setConfirmReset(false);
                    setMsg({ tone: 'success', text: 'All progress was reset.' });
                  }}
                >
                  Yes, delete everything
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)} autoFocus>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-danger-ghost btn-sm" onClick={() => setConfirmReset(true)}>
                Reset my progress…
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
