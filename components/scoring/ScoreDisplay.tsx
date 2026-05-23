'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Scorecard } from '@/lib/types';

export function ScoreDisplay({ scorecard }: { scorecard: Scorecard }) {
  return (
    <Card className="border-accent/30 bg-accent/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your score</CardTitle>
          <Badge className="text-lg px-3 py-1 bg-primary">
            {scorecard.overall_score}%
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{scorecard.reviewer_notes}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dimension</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scorecard.dimension_scores.map((d) => (
              <TableRow key={d.name}>
                <TableCell className="font-medium capitalize">
                  {d.name.replace(/_/g, ' ')}
                </TableCell>
                <TableCell>
                  {d.score}/{d.max_score}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {d.feedback}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-green-700 mb-1">Strengths</p>
            <ul className="list-disc pl-5 space-y-1">
              {scorecard.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-amber-700 mb-1">Gaps</p>
            <ul className="list-disc pl-5 space-y-1">
              {scorecard.gaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm">
          <span className="font-medium">Follow-up: </span>
          {scorecard.follow_up_question}
        </p>
      </CardContent>
    </Card>
  );
}
