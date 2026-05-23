'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  deleteTopic,
  getCatalog,
  upsertTopic,
} from '@/lib/repositories/catalog-repository';
import { PageHeader } from '@/components/layout/PageHeader';
import type { Topic } from '@/lib/types';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [skills, setSkills] = useState(getCatalog().skills);
  const [skillId, setSkillId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const reload = useCallback(() => {
    const catalog = getCatalog();
    setSkills(catalog.skills);
    setTopics(catalog.topics);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTopic = () => {
    if (!skillId || !name.trim() || !slug.trim()) return;
    upsertTopic({
      id: `top_${crypto.randomUUID().slice(0, 8)}`,
      skill_id: skillId,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      active: true,
    });
    setName('');
    setSlug('');
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Topics" description="Topics per skill" />
      <div className="flex flex-wrap gap-3 items-end border border-border rounded-lg p-4 bg-card">
        <div className="space-y-2 min-w-[160px]">
          <Label>Skill</Label>
          <Select value={skillId} onValueChange={setSkillId}>
            <SelectTrigger>
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={addTopic}>
          <Plus className="h-4 w-4 mr-2" />
          Add topic
        </Button>
      </div>
      <div className="border border-border rounded-lg bg-card overflow-x-auto max-h-[60vh]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((t, i) => (
              <TableRow key={t.id} className={i % 2 === 1 ? 'bg-muted/40' : undefined}>
                <TableCell>
                  {skills.find((s) => s.id === t.skill_id)?.name ?? t.skill_id}
                </TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell className="font-mono text-sm">{t.slug}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deleteTopic(t.id);
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
