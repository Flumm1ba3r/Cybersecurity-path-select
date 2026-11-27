import { useState } from 'react';
import type { Day, Week } from '../data/types';
import { useProgress } from '../hooks/useProgress';
import { dayProgress } from '../lib/progress';
import { getTaskResource, programmeMeta } from '../data/programme';
import { TaskResourceRow } from './TaskResourceRow';
import { Icon } from './Icon';
import { ProgressBar } from './ui';
import { StoredTextarea } from './StoredTextarea';

export function DayCard({ week, day, isNext, requested = false }: { week: Week; day: Day; isNext: boolean; requested?: boolean }) {
  const { state, toggleTask, setDayComplete, setDayNote } = useProgress();
  const p = dayProgress(state, day);
  const complete = p.pct === 100;
  const [open, setOpen] = useState(isNext || requested || (p.done > 0 && !complete));
  const nextIdx = day.tasks.findIndex((t) => !state.tasks[t.id]);

  // Open the card when it becomes the "next" day (e.g. after completing the previous one).
  // Also open it when a link asks for this day (?day=N).
  const [wasNext, setWasNext] = useState(isNext);
  if (isNext !== wasNext) {
    setWasNext(isNext);
    if (isNext) setOpen(true);
  }
  const [wasRequested, setWasRequested] = useState(requested);
  if (requested !== wasRequested) {
    setWasRequested(requested);
    if (requested) setOpen(true);
  }

  return (
    <section
      id={`day-${day.number}`}
      className={`day-card ${complete ? 'is-complete' : ''} ${isNext ? 'is-next' : ''}`}
      aria-labelledby={`${day.id}-h`}
    >
      <button
        type="button"
        className="day-toggle"
        aria-expanded={open}
        aria-controls={`${day.id}-panel`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`day-num ${complete ? 'done' : ''}`} aria-hidden="true">
          {complete ? <Icon name="check" size={18} /> : day.number}
        </span>
        <span className="day-heading">
          <span className="kicker">
            Day {day.number}
            {isNext && <span className="pill pill-next">Next up</span>}
            {complete && <span className="pill pill-done">Complete</span>}
          </span>
          <span id={`${day.id}-h`} className="day-title">
            {day.title}
          </span>
        </span>
        <span className="day-count">
          {p.done}/{p.total}
        </span>
        <Icon name="arrowRight" size={16} className={`chev ${open ? 'open' : ''}`} />
      </button>
      <ProgressBar pct={p.pct} small label={`Week ${week.number} day ${day.number} progress`} />

      <div id={`${day.id}-panel`} className="day-panel" hidden={!open}>
        <p className="muted small day-time">
          <Icon name="clock" size={13} /> Target time: {programmeMeta.dayTargetTime}
        </p>
        <ul className="task-list">
          {day.tasks.map((t, i) => {
            const checked = !!state.tasks[t.id];
            const resource = getTaskResource(t.id);
            return (
              <li key={t.id} className={`task ${checked ? 'is-done' : ''} ${i === nextIdx ? 'is-next' : ''}`} id={`task-${t.id}`}>
                <label>
                  <input type="checkbox" checked={checked} onChange={() => toggleTask(t.id)} />
                  <span className="checkbox" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="task-text">{t.text}</span>
                </label>
                {resource && <TaskResourceRow week={week} resource={resource} taskId={t.id} />}
                {i === nextIdx && <span className="task-next-tag">Next task</span>}
              </li>
            );
          })}
        </ul>

        <div className="deliverable">
          <Icon name="briefcase" size={16} />
          <div>
            <p className="kicker">Deliverable</p>
            <p>{day.deliverable}</p>
          </div>
        </div>

        <StoredTextarea
          label={
            <>
              <Icon name="note" size={13} /> My notes for day {day.number}
            </>
          }
          value={state.dayNotes[day.id] ?? ''}
          placeholder="Observations, questions or links to your own notes…"
          onSave={(v) => setDayNote(day.id, v)}
        />

        <div className="day-actions">
          <button
            type="button"
            className={`btn ${complete ? 'btn-ghost' : 'btn-success'}`}
            onClick={() => setDayComplete(day, !complete)}
          >
            <Icon name={complete ? 'x' : 'check'} size={16} />
            {complete ? 'Mark day incomplete' : 'Mark day complete'}
          </button>
          <span className="muted small">You can also tick each task. The day is complete once every task is ticked.</span>
        </div>
      </div>
    </section>
  );
}
