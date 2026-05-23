import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, setItem } from '@/lib/storage/local-storage';
import type { InterviewRun } from '@/lib/types';

export function getRuns(): InterviewRun[] {
  return getItem<InterviewRun[]>(STORAGE_KEYS.runs, []);
}

export function getRunById(id: string): InterviewRun | undefined {
  return getRuns().find((r) => r.run_id === id);
}

export function saveRun(run: InterviewRun): void {
  const runs = getRuns();
  const idx = runs.findIndex((r) => r.run_id === run.run_id);
  if (idx >= 0) runs[idx] = run;
  else runs.unshift(run);
  setItem(STORAGE_KEYS.runs, runs);
}
