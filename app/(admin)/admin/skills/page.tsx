'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  deleteSkill,
  getCatalog,
  upsertSkill,
} from '@/lib/repositories/catalog-repository';
import { PageHeader } from '@/components/layout/PageHeader';
import type { Skill } from '@/lib/types';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [interviewFocus, setInterviewFocus] = useState('');

  const reload = useCallback(() => {
    setSkills(getCatalog().skills);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addSkill = () => {
    if (!name.trim() || !slug.trim()) return;
    upsertSkill({
      id: `skill_${crypto.randomUUID().slice(0, 8)}`,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      interview_focus: interviewFocus.trim() || undefined,
      active: true,
    });
    setName('');
    setSlug('');
    setInterviewFocus('');
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Manage skill taxonomy" />
      <div className="flex flex-wrap gap-3 items-end border border-border rounded-lg p-4 bg-card">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="space-y-2 min-w-[200px]">
          <Label>Interview focus</Label>
          <Input
            value={interviewFocus}
            onChange={(e) => setInterviewFocus(e.target.value)}
            placeholder="e.g. hooks, state, rendering"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={addSkill}>
          <Plus className="h-4 w-4 mr-2" />
          Add skill
        </Button>
      </div>
      <div className="border border-border rounded-lg bg-card overflow-x-auto max-h-[60vh]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Interview focus</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((s, i) => (
              <TableRow key={s.id} className={i % 2 === 1 ? 'bg-muted/40' : undefined}>
                <TableCell>{s.name}</TableCell>
                <TableCell className="font-mono text-sm">{s.slug}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs">
                  {s.interview_focus ?? '—'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteSkill(s.id);
                      reload();
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
