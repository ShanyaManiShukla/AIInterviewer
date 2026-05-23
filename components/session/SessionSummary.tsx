'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScoreDisplay } from '@/components/scoring/ScoreDisplay';
import type { InterviewRun, PracticeSession } from '@/lib/types';

export function SessionSummary({
  session,
  run,
  onPrint,
}: {
  session: PracticeSession;
  run: InterviewRun;
  onPrint?: () => void;
}) {
  const avg =
    run.answers.length > 0
      ? Math.round(
          run.answers.reduce((s, a) => s + a.scorecard.overall_score, 0) /
            run.answers.length
        )
      : 0;

  return (
    <div className="space-y-6 print:space-y-4" id="session-summary">
      <div className="print:block hidden mb-4">
        <h1 className="text-2xl font-bold">AI Interview Practice — Session Report</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(run.completed_at ?? run.started_at).toLocaleString()}
        </p>
      </div>
      <Card className="border-border shadow-card">
        <CardHeader className="border-b border-accent/30">
          <CardTitle className="font-display">Interview summary</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Skill</p>
            <p className="font-medium">{session.config.skill}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Topic</p>
            <p className="font-medium">{session.config.topic || 'All'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Average score</p>
            <p className="font-medium text-2xl text-accent">{avg}%</p>
          </div>
        </CardContent>
      </Card>
      {run.answers.map((a, idx) => {
        const sq = session.questions.find(
          (q) => q.sequence === a.session_question_sequence
        );
        if (!sq) return null;
        return (
          <div
            key={a.session_question_sequence}
            className="space-y-3 break-inside-avoid pt-4 border-t border-accent/25"
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-display">
                  Q{a.session_question_sequence}: {sq.question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 font-medium">Your answer</p>
                <p className="text-sm whitespace-pre-wrap border border-border rounded p-3 bg-muted/50">
                  {a.answer_text || '(no answer)'}
                </p>
              </CardContent>
            </Card>
            <ScoreDisplay scorecard={a.scorecard} />
          </div>
        );
      })}
      <div className="flex gap-3 print:hidden">
        {onPrint && (
          <Button variant="outline" onClick={onPrint}>
            Export / Print PDF
          </Button>
        )}
        <Link href="/history">
          <Button variant="outline">View history</Button>
        </Link>
        <Link href="/generate">
          <Button className="bg-primary hover:bg-primary/90">Practice again</Button>
        </Link>
      </div>
    </div>
  );
}
