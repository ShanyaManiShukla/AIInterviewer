'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Question } from '@/lib/types';

export function QuestionCard({
  question,
  sequence,
  showReveal = true,
}: {
  question: Question;
  sequence?: number;
  showReveal?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {sequence != null && (
            <Badge variant="outline" className="border-accent/40">Q{sequence}</Badge>
          )}
          <Badge className="bg-primary text-primary-foreground">{question.question_type}</Badge>
          <Badge variant="secondary">{question.difficulty}</Badge>
          <Badge variant="outline" className="text-accent border-accent/40">
            {question.topic}
          </Badge>
        </div>
        <CardTitle className="text-lg font-display leading-snug">
          {question.question_text}
        </CardTitle>
        <CardDescription>
          {question.skills.join(', ')} · {question.source_type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {showReveal && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevealed(!revealed)}
            >
              {revealed ? 'Hide model answer' : 'Reveal model answer'}
            </Button>
            {revealed && (
              <div className="rounded-md bg-muted p-4 text-sm space-y-2">
                <p className="font-medium">{question.model_answer.summary}</p>
                <ul className="list-disc pl-5 text-foreground/90">
                  {question.model_answer.key_points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
