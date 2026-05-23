import { saveHistoryEntry, getHistoryBySessionId } from '@/lib/repositories/history-repository';
import { getRunById, saveRun } from '@/lib/repositories/run-repository';
import { getSessionById } from '@/lib/repositories/session-repository';
import { getCurrentUser } from '@/lib/services/auth-service';
import { mockScoreAnswer } from '@/lib/services/scoring-service';
import type { InterviewRun, RunState, ScoredAnswer } from '@/lib/types';

export function createInterviewRun(
  sessionId: string,
  timerMinutes = 5
): InterviewRun {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const session = getSessionById(sessionId);
  if (!session) throw new Error('Session not found');

  const run: InterviewRun = {
    run_id: `run_${crypto.randomUUID()}`,
    session_id: sessionId,
    user_id: user.id,
    state: 'countdown',
    current_question_index: 0,
    timer_seconds_per_question: timerMinutes * 60,
    answers: [],
    started_at: new Date().toISOString(),
  };

  saveRun(run);
  return run;
}

export function updateRunState(runId: string, state: RunState): InterviewRun {
  const run = getRunById(runId);
  if (!run) throw new Error('Run not found');
  const updated = { ...run, state };
  saveRun(updated);
  return updated;
}

export function setDraftAnswer(runId: string, text: string): InterviewRun {
  const run = getRunById(runId);
  if (!run) throw new Error('Run not found');
  const updated = { ...run, draft_answer: text, state: 'answering' as RunState };
  saveRun(updated);
  return updated;
}

export function submitAnswer(runId: string, answerText: string): InterviewRun {
  const run = getRunById(runId);
  if (!run) throw new Error('Run not found');

  const session = getSessionById(run.session_id);
  if (!session) throw new Error('Session not found');

  const current = session.questions[run.current_question_index];
  if (!current) throw new Error('No current question');

  const alreadySubmitted = run.answers.some(
    (a) => a.session_question_sequence === current.sequence
  );
  if (alreadySubmitted) return run;

  const scorecard = mockScoreAnswer(current.question, answerText);
  const scored: ScoredAnswer = {
    session_question_sequence: current.sequence,
    answer_text: answerText,
    submitted_at: new Date().toISOString(),
    scorecard,
  };

  const answers = [...run.answers, scored];
  const isLast = run.current_question_index >= session.questions.length - 1;

  const updated: InterviewRun = {
    ...run,
    answers,
    draft_answer: undefined,
    state: isLast ? 'complete' : 'next',
    current_question_index: isLast
      ? run.current_question_index
      : run.current_question_index + 1,
    completed_at: isLast ? new Date().toISOString() : undefined,
  };

  saveRun(updated);

  if (isLast) {
    const avg =
      answers.reduce((s, a) => s + a.scorecard.overall_score, 0) / answers.length;
    const history = getHistoryBySessionId(run.session_id);
    if (history) {
      saveHistoryEntry({
        ...history,
        run_id: run.run_id,
        average_score: Math.round(avg),
        completed: true,
      });
    }
  }

  return updated;
}

export function advanceToAnswering(runId: string): InterviewRun {
  const run = getRunById(runId);
  if (!run) throw new Error('Run not found');
  const updated = { ...run, state: 'asking' as RunState };
  saveRun(updated);
  return updated;
}

export function advanceFromNext(runId: string): InterviewRun {
  const run = getRunById(runId);
  if (!run) throw new Error('Run not found');
  const updated = { ...run, state: 'asking' as RunState };
  saveRun(updated);
  return updated;
}

export function getRunWithSession(runId: string) {
  const run = getRunById(runId);
  if (!run) return null;
  const session = getSessionById(run.session_id);
  if (!session) return null;
  return { run, session };
}
