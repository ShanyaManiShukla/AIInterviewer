'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Clock, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerItem, StaggerList } from '@/components/motion/StaggerList';
import { cardHover } from '@/lib/design/cn-page';
import { getHistory } from '@/lib/repositories/history-repository';
import { getSessions } from '@/lib/repositories/session-repository';
import { getQuestionPool } from '@/lib/repositories/question-pool-repository';
import { getSkills } from '@/lib/repositories/catalog-repository';
import type { HistoryEntry } from '@/lib/types';

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [poolCount, setPoolCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);

  useEffect(() => {
    setHistory(getHistory().slice(0, 5));
    setSessionCount(getSessions().length);
    setPoolCount(getQuestionPool().length);
    setSkillCount(getSkills().length);
  }, []);

  const completed = history.filter((h) => h.completed).length;
  const avgScore =
    history.filter((h) => h.average_score != null).length > 0
      ? Math.round(
          history
            .filter((h) => h.average_score != null)
            .reduce((s, h) => s + (h.average_score ?? 0), 0) /
            history.filter((h) => h.average_score != null).length
        )
      : null;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your interview practice at a glance"
        action={
          <Link href="/generate">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </Link>
        }
      />

      <StaggerList className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Question bank', value: poolCount },
          { label: 'Skills', value: skillCount },
          { label: 'Sessions', value: sessionCount },
          { label: 'Avg score', value: avgScore != null ? `${avgScore}%` : '—' },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <Card className="border-border shadow-card">
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl font-display">{s.value}</CardTitle>
              </CardHeader>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>

      <StaggerList className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: BarChart3,
            title: 'Generate questions',
            desc: 'Random set from 400 curated questions',
            href: '/generate',
            primary: true,
          },
          {
            icon: FileText,
            title: 'Question bank',
            desc: 'Browse and filter all questions',
            href: '/questions/static',
          },
          {
            icon: Clock,
            title: 'History',
            desc: `${completed} completed runs`,
            href: '/history',
          },
        ].map((item) => (
          <StaggerItem key={item.href}>
            <Card className={`h-full border-border ${cardHover}`}>
              <CardHeader>
                <item.icon className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="font-display">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href}>
                  <Button
                    variant={item.primary ? 'default' : 'outline'}
                    className={
                      item.primary
                        ? 'w-full bg-primary hover:bg-primary/90'
                        : 'w-full'
                    }
                  >
                    Open <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No sessions yet.{' '}
              <Link href="/generate" className="text-accent hover:underline">
                Generate your first set
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li
                  key={h.session_id}
                  className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-0"
                >
                  <span className="capitalize">
                    {h.skill} / {h.topic || 'all'} — {h.difficulty}
                  </span>
                  <Link
                    href={`/history/${h.session_id}`}
                    className="text-accent hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
