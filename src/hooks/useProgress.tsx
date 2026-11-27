import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clearState, emptyState, loadState, saveState, type ComparisonEntry, type ProgressState } from '../lib/storage';
import type { Day } from '../data/types';

interface ProgressApi {
  state: ProgressState;
  storageOk: boolean;
  toggleTask: (taskId: string) => void;
  setDayComplete: (day: Day, complete: boolean) => void;
  setDayNote: (dayId: string, note: string) => void;
  setWeekReflection: (weekId: string, qIndex: number, score: number | null) => void;
  setComparison: (weekId: string, patch: Partial<ComparisonEntry>) => void;
  setFinalAnswer: (qIndex: number, text: string) => void;
  setLastWeek: (weekId: string) => void;
  replaceAll: (s: ProgressState) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState);
  const [storageOk, setStorageOk] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStorageOk(saveState(state));
  }, [state]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith('cyber-field-notes')) setState(loadState());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((s) => ({ ...fn(s), updatedAt: new Date().toISOString() }));
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      storageOk,
      toggleTask: (id) =>
        update((s) => {
          const tasks = { ...s.tasks };
          if (tasks[id]) delete tasks[id];
          else tasks[id] = true;
          return { ...s, tasks };
        }),
      setDayComplete: (day, complete) =>
        update((s) => {
          const tasks = { ...s.tasks };
          for (const t of day.tasks) {
            if (complete) tasks[t.id] = true;
            else delete tasks[t.id];
          }
          return { ...s, tasks };
        }),
      setDayNote: (dayId, note) => update((s) => ({ ...s, dayNotes: { ...s.dayNotes, [dayId]: note } })),
      setWeekReflection: (weekId, q, score) =>
        update((s) => {
          const w = { ...(s.weekReflections[weekId] ?? {}) };
          if (score === null) delete w[q];
          else w[q] = score;
          return { ...s, weekReflections: { ...s.weekReflections, [weekId]: w } };
        }),
      setComparison: (weekId, patch) =>
        update((s) => {
          const e: ComparisonEntry = { ...(s.comparison[weekId] ?? {}), ...patch };
          for (const k of Object.keys(e) as (keyof ComparisonEntry)[]) if (e[k] === undefined) delete e[k];
          return { ...s, comparison: { ...s.comparison, [weekId]: e } };
        }),
      setFinalAnswer: (q, text) => update((s) => ({ ...s, finalAnswers: { ...s.finalAnswers, [q]: text } })),
      setLastWeek: (weekId) => setState((s) => (s.lastWeekId === weekId ? s : { ...s, lastWeekId: weekId })),
      replaceAll: (s) => setState({ ...s, updatedAt: new Date().toISOString() }),
      reset: () => {
        clearState();
        setState(emptyState());
      },
    }),
    [state, storageOk, update],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be used inside <ProgressProvider>');
  return v;
}
