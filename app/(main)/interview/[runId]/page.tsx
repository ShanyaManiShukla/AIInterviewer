'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnswerInput } from '@/components/interview/AnswerInput';
import { InterviewTimer } from '@/components/interview/InterviewTimer';
import { ScoreDisplay } from '@/components/scoring/ScoreDisplay';
import { getRunById } from '@/lib/repositories/run-repository';
import {
  advanceFromNext,
  advanceToAnswering,
  getRunWithSession,
  setDraftAnswer,
  submitAnswer,
} from '@/lib/services/interview-run-service';
import type { InterviewRun, PracticeSession } from '@/lib/types';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const runId = params.runId as string;

  const [run, setRun] = useState<InterviewRun | null>(null);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [answer, setAnswer] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [showScore, setShowScore] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const reload = useCallback(() => {
    const data = getRunWithSession(runId);
    if (data) {
      setRun(data.run);
      setSession(data.session);
      setAnswer(data.run.draft_answer ?? '');
    }
  }, [runId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (run?.state !== 'countdown') return;
    if (countdown <= 0) {
      advanceToAnswering(runId);
      reload();
      setTimerRunning(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [run?.state, countdown, runId, reload]);

  useEffect(() => {
    if (run?.state !== 'next') return;
    setShowScore(false);
    setAnswer('');
    const t = setTimeout(() => {
      advanceFromNext(runId);
      reload();
      setTimerRunning(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [run?.state, runId, reload]);

  useEffect(() => {
    if (run?.state === 'complete') {
      router.push(`/session/${runId}`);
    }
  }, [run?.state, runId, router]);

  const doSubmit = useCallback(
    (text: string) => {
      submitAnswer(runId, text);
      const updated = getRunById(runId);
      if (!updated) return;
      setRun(updated);
      setShowScore(true);
      setTimerRunning(false);
    },
    [runId]
  );

  const handleSubmit = () => {
    doSubmit(answer.trim() || '(no answer)');
  };

  const handleExpire = () => {
    setTimerRunning(false);
    doSubmit(answer.trim() || '(timed out — no answer)');
  };

  if (!run || !session) {
    return <p className="text-muted-foreground">Loading interview…</p>;
  }

  const current = session.questions[run.current_question_index];
  const total = session.questions.length;
  const progress = ((run.current_question_index + 1) / total) * 100;
  const lastScored = run.answers[run.answers.length - 1];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Mock interview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Question {run.current_question_index + 1} of {total}
        </p>
        <div className="h-2 w-full rounded-full bg-muted mt-3 overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Dialog open={run.state === 'countdown'}>
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <DialogTitle>Get ready</DialogTitle>
            <DialogDescription>Interview starts in</DialogDescription>
          </DialogHeader>
          <p className="text-5xl font-display font-bold text-accent py-4 animate-pulse">
            {countdown}
          </p>
        </DialogContent>
      </Dialog>

      {current && run.state !== 'countdown' && run.state !== 'complete' && (
        <>
          <InterviewTimer
            key={`timer-${run.current_question_index}-${showScore}`}
            secondsTotal={run.timer_seconds_per_question}
            running={timerRunning && !showScore}
            onExpire={handleExpire}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-snug">
                {current.question.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showScore ? (
                <>
                  <AnswerInput
                    value={answer}
                    onChange={(v) => {
                      setAnswer(v);
                      setDraftAnswer(runId, v);
                    }}
                  />
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleSubmit}
                  >
                    Submit answer
                  </Button>
                </>
              ) : (
                lastScored && <ScoreDisplay scorecard={lastScored.scorecard} />
              )}
            </CardContent>
          </Card>
          {showScore && run.state === 'next' && (
            <p className="text-center text-muted-foreground text-sm">Next question…</p>
          )}
        </>
      )}
    </div>
  );
}
