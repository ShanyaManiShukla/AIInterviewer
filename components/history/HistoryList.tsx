'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaggerItem, StaggerList } from '@/components/motion/StaggerList';
import { cardHover } from '@/lib/design/cn-page';
import type { HistoryEntry } from '@/lib/types';

export function HistoryList({
  entries,
  skillFilter,
  onSkillFilter,
  skills,
}: {
  entries: HistoryEntry[];
  skillFilter: string;
  onSkillFilter: (v: string) => void;
  skills: string[];
}) {
  const filtered =
    skillFilter === 'all'
      ? entries
      : entries.filter((e) => e.skill === skillFilter);

  return (
    <div className="space-y-4">
      <Select value={skillFilter} onValueChange={onSkillFilter}>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Filter by skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All skills</SelectItem>
          {skills.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No history yet.</p>
      ) : (
        <StaggerList className="space-y-4">
        {filtered.map((h) => (
          <StaggerItem key={h.session_id}>
          <Card className={`border-border ${cardHover}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-display capitalize">
                  {h.skill} — {h.topic || 'all topics'}
                </CardTitle>
                <Badge variant={h.completed ? 'default' : 'secondary'}>
                  {h.completed ? 'Completed' : 'In progress'}
                </Badge>
              </div>
              <CardDescription>
                {new Date(h.created_at).toLocaleString()} · {h.difficulty} ·{' '}
                {h.question_count} questions
                {h.average_score != null && ` · Avg ${h.average_score}%`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/history/${h.session_id}`}
                className="text-accent text-sm hover:underline"
              >
                View details →
              </Link>
            </CardContent>
          </Card>
          </StaggerItem>
        ))}
        </StaggerList>
      )}
    </div>
  );
}
