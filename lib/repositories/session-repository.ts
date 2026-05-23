import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, setItem } from '@/lib/storage/local-storage';
import type { PracticeSession } from '@/lib/types';

export function getSessions(): PracticeSession[] {
  return getItem<PracticeSession[]>(STORAGE_KEYS.sessions, []);
}

export function getSessionById(id: string): PracticeSession | undefined {
  return getSessions().find((s) => s.session_id === id);
}

export function saveSession(session: PracticeSession): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.session_id === session.session_id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  setItem(STORAGE_KEYS.sessions, sessions);
}
