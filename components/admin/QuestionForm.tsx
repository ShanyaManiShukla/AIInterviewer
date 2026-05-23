'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getSkills } from '@/lib/repositories/catalog-repository';
import { QUESTION_TYPES } from '@/lib/services/question-service';
import type { Difficulty, Question, QuestionStatus, QuestionType } from '@/lib/types';

const emptyQuestion = (): Question => ({
  question_id: `q_${crypto.randomUUID().slice(0, 8)}`,
  question_text: '',
  question_type: 'conceptual',
  difficulty: 'intermediate',
  topic: '',
  skills: ['javascript'] as string[],
  expected_answer_outline: [''],
  rubric: {
    dimensions: [
      { name: 'accuracy', weight: 0.5 },
      { name: 'clarity', weight: 0.5 },
    ],
    max_score: 100,
  },
  model_answer: { summary: '', key_points: [''] },
  source_type: 'curated',
  status: 'draft',
});

export function QuestionForm({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Question;
  onSave: (q: Question) => void;
}) {
  const [form, setForm] = useState<Question>(initial ?? emptyQuestion());

  const reset = (q?: Question) => setForm(q ?? emptyQuestion());

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
        else if (initial) setForm(initial);
      }}
    >
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{initial ? 'Edit question' : 'New question'}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Question text</Label>
            <Textarea
              value={form.question_text}
              onChange={(e) =>
                setForm({ ...form, question_text: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.question_type}
                onValueChange={(v) =>
                  setForm({ ...form, question_type: v as QuestionType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={form.difficulty}
                onValueChange={(v) =>
                  setForm({ ...form, difficulty: v as Difficulty })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">beginner</SelectItem>
                  <SelectItem value="intermediate">intermediate</SelectItem>
                  <SelectItem value="advanced">advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Topic slug</Label>
            <Input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary skill</Label>
            <Select
              value={form.skills[0] ?? ''}
              onValueChange={(v) => setForm({ ...form, skills: [v] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {getSkills().map((s) => (
                  <SelectItem key={s.id} value={s.slug}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as QuestionStatus })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="archived">archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model answer summary</Label>
            <Textarea
              value={form.model_answer.summary}
              onChange={(e) =>
                setForm({
                  ...form,
                  model_answer: { ...form.model_answer, summary: e.target.value },
                })
              }
              rows={3}
            />
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              onSave(form);
              onOpenChange(false);
              reset();
            }}
          >
            Save question
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
