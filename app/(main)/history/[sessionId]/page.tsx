'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { SessionSummary } from '@/components/session/SessionSummary';
import { getSessionById } from '@/lib/repositories/session-repository';
import { getRuns } from '@/lib/repositories/run-repository';
import { getRunWithSession } from '@/lib/services/interview-run-service';
import type { InterviewRun, PracticeSession } from '@/lib/types';

export default function HistoryDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [run, setRun] = useState<InterviewRun | null>(null);

  useEffect(() => {
    const s = getSessionById(sessionId);
    setSession(s ?? null);
    const runs = getRuns().filter((r) => r.session_id === sessionId);
    const completed = runs.find((r) => r.state === 'complete');
    if (completed) {
      const data = getRunWithSession(completed.run_id);
      if (data) setRun(data.run);
    }
  }, [sessionId]);

  if (!session) {
    return <p className="text-muted-foreground">Session not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/history" className="text-sm text-accent hover:underline">
          ← Back to history
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-2">Session detail</h1>
        <p className="text-muted-foreground mt-1">
          {session.config.skill} · {session.config.difficulty} ·{' '}
          {new Date(session.created_at).toLocaleString()}
        </p>
      </div>

      {run ? (
        <SessionSummary
          session={session}
          run={run}
          onPrint={() => window.print()}
        />
      ) : (
        <>
          <div className="grid gap-4">
            {session.questions.map((sq) => (
              <QuestionCard
                key={sq.sequence}
                question={sq.question}
                sequence={sq.sequence}
              />
            ))}
          </div>
          <Link href={`/sessions/${session.session_id}`}>
            <Button className="bg-primary hover:bg-primary/90">
              Open session
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
