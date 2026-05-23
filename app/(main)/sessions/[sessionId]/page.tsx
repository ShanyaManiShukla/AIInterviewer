'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { getSessionById } from '@/lib/repositories/session-repository';
import { createInterviewRun } from '@/lib/services/interview-run-service';
import type { PracticeSession } from '@/lib/types';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    setSession(getSessionById(sessionId) ?? null);
  }, [sessionId]);

  if (!session) {
    return (
      <p className="text-muted-foreground">
        Session not found.{' '}
        <Link href="/generate" className="text-accent hover:underline">
          Generate a new set
        </Link>
      </p>
    );
  }

  const startMock = () => {
    const minutes = session.config.time_per_question_minutes ?? 5;
    const run = createInterviewRun(session.session_id, minutes);
    router.push(`/interview/${run.run_id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your question set</h1>
          <p className="text-muted-foreground mt-1">
            {session.config.skill} · {session.config.topic || 'all topics'} ·{' '}
            {session.config.difficulty} · {session.questions.length} questions
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={startMock}
        >
          <Play className="h-4 w-4 mr-2" />
          Start mock interview
        </Button>
      </div>
      <div className="grid gap-4">
        {session.questions.map((sq) => (
          <QuestionCard
            key={sq.sequence}
            question={sq.question}
            sequence={sq.sequence}
          />
        ))}
      </div>
    </div>
  );
}
