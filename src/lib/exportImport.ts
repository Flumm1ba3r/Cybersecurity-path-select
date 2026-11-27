import { comparisonMetrics, finalQuestions, weeks } from '../data/programme';
import { reflectionAverage, weekProgress } from './progress';
import { SCHEMA_VERSION, validateProgress, type ProgressState } from './storage';

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function exportBackup(state: ProgressState) {
  const payload = { app: 'cybersecurity-field-notes', exportedAt: new Date().toISOString(), progress: { ...state, version: SCHEMA_VERSION } };
  downloadFile(`field-notes-backup-${stamp()}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

export async function readBackupFile(file: File) {
  if (file.size > 2_000_000) return { ok: false as const, error: 'File is too large to be a progress backup.' };
  let json: unknown;
  try {
    json = JSON.parse(await file.text());
  } catch {
    return { ok: false as const, error: 'The file is not valid JSON.' };
  }
  return validateProgress(json);
}

export function reflectionsJson(state: ProgressState) {
  return {
    exportedAt: new Date().toISOString(),
    note: 'Personal reflection aid – not an objective career aptitude test.',
    disciplines: weeks.map((w) => ({
      week: w.number,
      discipline: w.title,
      challenge: `${w.challenge.platform} — ${w.challenge.title}`,
      taskCompletionPct: weekProgress(state, w).pct,
      weeklyReflection: w.weeklyReflectionQuestions.map((q, i) => ({ statement: q, score: state.weekReflections[w.id]?.[i] ?? null })),
      comparison: Object.fromEntries(comparisonMetrics.map((m) => [m.key, state.comparison[w.id]?.[m.key] ?? null])),
      observations: state.comparison[w.id]?.notes ?? '',
    })),
    questions: finalQuestions.map((q, i) => ({ question: q, answer: state.finalAnswers[i] ?? '' })),
  };
}

export function reflectionsMarkdown(state: ProgressState): string {
  const s = (v: number | undefined | null) => (v ? String(v) : '–');
  const lines: string[] = [
    '# Cybersecurity Field Notes — Career Reflection',
    '',
    `_Exported ${stamp()}. A personal reflection aid, not an objective career aptitude test._`,
    '',
    '## Scorecard',
    '',
    `| Discipline | ${comparisonMetrics.map((m) => m.label).join(' | ')} | Weekly reflection avg | Tasks done |`,
    `|---|${comparisonMetrics.map(() => '---:').join('|')}|---:|---:|`,
  ];
  for (const w of weeks) {
    const c = state.comparison[w.id] ?? {};
    const avg = reflectionAverage(state, w);
    lines.push(
      `| ${w.title} | ${comparisonMetrics.map((m) => s(c[m.key])).join(' | ')} | ${avg ? avg.toFixed(1) : '–'} | ${weekProgress(state, w).pct}% |`,
    );
  }
  lines.push('', '## Observations', '');
  for (const w of weeks) {
    lines.push(`### Week ${w.number} — ${w.title}`, '');
    w.weeklyReflectionQuestions.forEach((q, i) => lines.push(`- ${q} **${s(state.weekReflections[w.id]?.[i])}/5**`));
    const notes = state.comparison[w.id]?.notes?.trim();
    lines.push('', notes ? notes : '_No observations recorded._', '');
  }
  lines.push('## Questions to answer', '');
  finalQuestions.forEach((q, i) => {
    lines.push(`${i + 1}. **${q}**`, '', `   ${state.finalAnswers[i]?.trim() || '_Not answered yet._'}`, '');
  });
  return lines.join('\n');
}

export function exportReflections(state: ProgressState, format: 'md' | 'json') {
  if (format === 'md') downloadFile(`career-reflection-${stamp()}.md`, reflectionsMarkdown(state), 'text/markdown');
  else downloadFile(`career-reflection-${stamp()}.json`, JSON.stringify(reflectionsJson(state), null, 2), 'application/json');
}
