import { allTaskIds, weeks, comparisonMetrics } from '../data/programme';
import type { Day, Week } from '../data/types';
import type { ProgressState } from './storage';

export interface Fraction {
  done: number;
  total: number;
  pct: number;
}

const frac = (done: number, total: number): Fraction => ({ done, total, pct: total ? Math.round((done / total) * 100) : 0 });

export function dayProgress(state: ProgressState, day: Day): Fraction {
  return frac(day.tasks.filter((t) => state.tasks[t.id]).length, day.tasks.length);
}

export function weekProgress(state: ProgressState, week: Week): Fraction {
  const ids = week.days.flatMap((d) => d.tasks.map((t) => t.id));
  return frac(ids.filter((id) => state.tasks[id]).length, ids.length);
}

export function daysComplete(state: ProgressState, week: Week): number {
  return week.days.filter((d) => dayProgress(state, d).pct === 100).length;
}

export function overallProgress(state: ProgressState): Fraction {
  return frac(allTaskIds.filter((id) => state.tasks[id]).length, allTaskIds.length);
}

export type WeekStatus = 'not-started' | 'in-progress' | 'complete';
export function weekStatus(state: ProgressState, week: Week): WeekStatus {
  const p = weekProgress(state, week);
  return p.done === 0 ? 'not-started' : p.pct === 100 ? 'complete' : 'in-progress';
}

export interface NextTask {
  week: Week;
  day: Day;
  taskIndex: number;
}

/** First incomplete task in programme order – derived purely from saved progress. */
export function nextTask(state: ProgressState): NextTask | null {
  for (const week of weeks)
    for (const day of week.days) {
      const i = day.tasks.findIndex((t) => !state.tasks[t.id]);
      if (i !== -1) return { week, day, taskIndex: i };
    }
  return null;
}

export function nextTaskInWeek(state: ProgressState, week: Week): NextTask | null {
  for (const day of week.days) {
    const i = day.tasks.findIndex((t) => !state.tasks[t.id]);
    if (i !== -1) return { week, day, taskIndex: i };
  }
  return null;
}

export function reflectionAverage(state: ProgressState, week: Week): number | null {
  const scores = Object.values(state.weekReflections[week.id] ?? {});
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

export function comparisonAverage(state: ProgressState, week: Week): number | null {
  const e = state.comparison[week.id];
  if (!e) return null;
  const vals = comparisonMetrics.map((m) => e[m.key]).filter((v): v is number => typeof v === 'number');
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/** Comparison score if entered, otherwise the weekly reflection average. */
export function explorationScore(state: ProgressState, week: Week): { value: number; source: 'comparison' | 'weekly' } | null {
  const c = comparisonAverage(state, week);
  if (c !== null) return { value: c, source: 'comparison' };
  const r = reflectionAverage(state, week);
  return r !== null ? { value: r, source: 'weekly' } : null;
}
