'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerItem, StaggerList } from '@/components/motion/StaggerList';
import { getSkills } from '@/lib/repositories/catalog-repository';
import { getQuestionPool } from '@/lib/repositories/question-pool-repository';
import { normalizeSkillSlugForFilter } from '@/lib/services/skill-utils';
import { QUESTION_TYPES } from '@/lib/services/question-service';
import type { Question } from '@/lib/types';

const PAGE_SIZE = 20;

export default function StaticQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const pool = getQuestionPool();
    setQuestions(pool);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (skillFilter !== 'all') {
        const match = q.skills.some(
          (s) => normalizeSkillSlugForFilter(s) === skillFilter
        );
        if (!match) return false;
      }
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
        return false;
      }
      if (typeFilter !== 'all' && q.question_type !== typeFilter) {
        return false;
      }
      const term = search.toLowerCase();
      if (!term) return true;
      return (
        q.question_text.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.skills.some((s) => s.toLowerCase().includes(term))
      );
    });
  }, [questions, skillFilter, difficultyFilter, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [skillFilter, difficultyFilter, typeFilter, search]);

  const skills = getSkills();

  return (
    <div>
      <PageHeader
        title="Question bank"
        description={`Browse ${questions.length} curated questions across ${skills.length} skills`}
      />
      <div className="flex flex-wrap gap-4 items-end mb-8">
        <div className="space-y-2">
          <Label>Skill</Label>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              {skills.map((s) => (
                <SelectItem key={s.id} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex-1 min-w-[200px]">
          <Label>Search</Label>
          <Input
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {pageItems.length} of {filtered.length} matches
          </p>
          <StaggerList className="grid gap-4" key={page}>
            {pageItems.map((q, i) => (
              <StaggerItem key={q.question_id}>
                <QuestionCard
                  question={q}
                  sequence={(page - 1) * PAGE_SIZE + i + 1}
                />
              </StaggerItem>
            ))}
          </StaggerList>
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm">No questions match your filters.</p>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
