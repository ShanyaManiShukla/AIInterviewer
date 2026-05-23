import { saveHistoryEntry } from '@/lib/repositories/history-repository';
import { saveSession } from '@/lib/repositories/session-repository';
import { getCurrentUser } from '@/lib/services/auth-service';
import { generateQuestionsFromPool } from '@/lib/services/question-service';
import type { GenerationConfig, PracticeSession } from '@/lib/types';

export function createPracticeSession(config: GenerationConfig): PracticeSession {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const questions = generateQuestionsFromPool(config);
  const session: PracticeSession = {
    session_id: `sess_${crypto.randomUUID()}`,
    user_id: user.id,
    config,
    questions,
    created_at: new Date().toISOString(),
  };

  saveSession(session);
  saveHistoryEntry({
    session_id: session.session_id,
    skill: config.skill,
    topic: config.topic,
    difficulty: config.difficulty,
    question_count: questions.length,
    created_at: session.created_at,
    completed: false,
  });

  return session;
}
