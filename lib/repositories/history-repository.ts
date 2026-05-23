import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, setItem } from '@/lib/storage/local-storage';
import type { HistoryEntry } from '@/lib/types';

export function getHistory(): HistoryEntry[] {
  return getItem<HistoryEntry[]>(STORAGE_KEYS.history, []);
}

export function saveHistoryEntry(entry: HistoryEntry): void {
  const history = getHistory();
  const idx = history.findIndex((h) => h.session_id === entry.session_id);
  if (idx >= 0) history[idx] = entry;
  else history.unshift(entry);
  setItem(STORAGE_KEYS.history, history);
}

export function getHistoryBySessionId(sessionId: string): HistoryEntry | undefined {
  return getHistory().find((h) => h.session_id === sessionId);
}
