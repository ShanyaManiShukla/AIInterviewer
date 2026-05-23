'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCatalog } from '@/lib/repositories/catalog-repository';
import { getQuestionPool } from '@/lib/repositories/question-pool-repository';
import { PageHeader } from '@/components/layout/PageHeader';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    questions: 0,
    approved: 0,
    skills: 0,
    topics: 0,
  });

  useEffect(() => {
    const pool = getQuestionPool();
    const catalog = getCatalog();
    setStats({
      questions: pool.length,
      approved: pool.filter((q) => q.status === 'approved').length,
      skills: catalog.skills.length,
      topics: catalog.topics.length,
    });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin"
        description="Manage question bank and taxonomy"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total questions', value: stats.questions },
          { label: 'Approved', value: stats.approved },
          { label: 'Skills', value: stats.skills },
          { label: 'Topics', value: stats.topics },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/questions">
          <Button className="bg-primary hover:bg-primary/90">Question bank</Button>
        </Link>
        <Link href="/admin/skills">
          <Button variant="outline">Skills</Button>
        </Link>
        <Link href="/admin/topics">
          <Button variant="outline">Topics</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Skill catalog</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Main interview focus</TableHead>
                <TableHead>Topics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCatalog().skills.map((skill, i) => {
                const topicCount = getCatalog().topics.filter(
                  (t) => t.skill_id === skill.id
                ).length;
                return (
                  <TableRow key={skill.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      {skill.interview_focus ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">{topicCount} topics</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
