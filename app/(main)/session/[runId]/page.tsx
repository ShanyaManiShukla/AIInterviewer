'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SessionSummary } from '@/components/session/SessionSummary';
import { getRunWithSession } from '@/lib/services/interview-run-service';
import type { InterviewRun, PracticeSession } from '@/lib/types';

export default function SessionSummaryPage() {
  const params = useParams();
  const runId = params.runId as string;
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [run, setRun] = useState<InterviewRun | null>(null);

  useEffect(() => {
    const data = getRunWithSession(runId);
    if (data) {
      setSession(data.session);
      setRun(data.run);
    }
  }, [runId]);

  if (!session || !run) {
    return (
      <p className="text-muted-foreground">
        Session not found.{' '}
        <Link href="/history" className="text-accent hover:underline">
          View history
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold text-foreground">Session complete</h1>
        <p className="text-muted-foreground mt-1">Review your answers and scores</p>
      </div>
      <SessionSummary
        session={session}
        run={run}
        onPrint={() => window.print()}
      />
    </div>
  );
}
