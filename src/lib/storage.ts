import type { ComparisonMetricKey } from '../data/programme';

export const STORAGE_KEY = 'cyber-field-notes:v1';
export const SCHEMA_VERSION = 1;

export type ComparisonEntry = Partial<Record<ComparisonMetricKey, number>> & { notes?: string };

export interface ProgressState {
  version: number;
  /** taskId -> completed */
  tasks: Record<string, boolean>;
  /** dayId -> note text */
  dayNotes: Record<string, string>;
  /** weekId -> question index -> 1..5 */
  weekReflections: Record<string, Record<string, number>>;
  /** weekId -> comparison scores */
  comparison: Record<string, ComparisonEntry>;
  /** final question index -> answer */
  finalAnswers: Record<string, string>;
  lastWeekId?: string;
  updatedAt?: string;
}

export const emptyState = (): ProgressState => ({
  version: SCHEMA_VERSION,
  tasks: {},
  dayNotes: {},
  weekReflections: {},
  comparison: {},
  finalAnswers: {},
});

export function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = validateProgress(JSON.parse(raw));
    return parsed.ok ? parsed.state : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state: ProgressState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable – nothing to clear */
  }
}

const MAX_TEXT = 20_000;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const idRe = /^[a-z0-9-]{1,40}$/i;

type Result = { ok: true; state: ProgressState } | { ok: false; error: string };

/** Strictly validates an unknown value (e.g. imported JSON) and returns a clean copy. */
export function validateProgress(input: unknown): Result {
  if (!isObj(input)) return { ok: false, error: 'The file is not a progress backup (expected a JSON object).' };
  const src = isObj(input.progress) ? input.progress : input; // accept wrapped export
  if (typeof src.version !== 'number' || src.version > SCHEMA_VERSION)
    return { ok: false, error: 'Unsupported or missing backup version.' };

  const out = emptyState();
  const strMap = (v: unknown, name: string): Record<string, string> | string => {
    if (v === undefined) return {};
    if (!isObj(v)) return `"${name}" must be an object.`;
    const r: Record<string, string> = {};
    for (const [k, val] of Object.entries(v)) {
      if (!idRe.test(k)) return `Invalid key "${k}" in "${name}".`;
      if (typeof val !== 'string') return `"${name}.${k}" must be text.`;
      r[k] = val.slice(0, MAX_TEXT);
    }
    return r;
  };
  const score = (v: unknown) => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5;

  if (src.tasks !== undefined) {
    if (!isObj(src.tasks)) return { ok: false, error: '"tasks" must be an object.' };
    for (const [k, v] of Object.entries(src.tasks)) {
      if (!idRe.test(k) || typeof v !== 'boolean') return { ok: false, error: `Invalid task entry "${k}".` };
      if (v) out.tasks[k] = true;
    }
  }
  for (const key of ['dayNotes', 'finalAnswers'] as const) {
    const r = strMap(src[key], key);
    if (typeof r === 'string') return { ok: false, error: r };
    out[key] = r;
  }
  if (src.weekReflections !== undefined) {
    if (!isObj(src.weekReflections)) return { ok: false, error: '"weekReflections" must be an object.' };
    for (const [w, qs] of Object.entries(src.weekReflections)) {
      if (!idRe.test(w) || !isObj(qs)) return { ok: false, error: `Invalid reflection entry "${w}".` };
      out.weekReflections[w] = {};
      for (const [q, s] of Object.entries(qs)) {
        if (!/^\d{1,2}$/.test(q) || !score(s)) return { ok: false, error: `Reflection scores must be whole numbers 1–5 (${w}.${q}).` };
        out.weekReflections[w][q] = s as number;
      }
    }
  }
  if (src.comparison !== undefined) {
    if (!isObj(src.comparison)) return { ok: false, error: '"comparison" must be an object.' };
    for (const [w, entry] of Object.entries(src.comparison)) {
      if (!idRe.test(w) || !isObj(entry)) return { ok: false, error: `Invalid comparison entry "${w}".` };
      const e: ComparisonEntry = {};
      for (const [k, v] of Object.entries(entry)) {
        if (k === 'notes') {
          if (typeof v !== 'string') return { ok: false, error: `Comparison notes for ${w} must be text.` };
          e.notes = v.slice(0, MAX_TEXT);
        } else if (['enjoyment', 'curiosity', 'dailyFit', 'practical'].includes(k)) {
          if (!score(v)) return { ok: false, error: `Comparison scores must be whole numbers 1–5 (${w}.${k}).` };
          e[k as ComparisonMetricKey] = v as number;
        } else return { ok: false, error: `Unknown comparison field "${k}".` };
      }
      out.comparison[w] = e;
    }
  }
  if (src.lastWeekId !== undefined) {
    if (typeof src.lastWeekId !== 'string' || !idRe.test(src.lastWeekId)) return { ok: false, error: 'Invalid "lastWeekId".' };
    out.lastWeekId = src.lastWeekId;
  }
  return { ok: true, state: out };
}
