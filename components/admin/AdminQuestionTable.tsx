'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QuestionForm } from '@/components/admin/QuestionForm';
import {
  deleteQuestion,
  getQuestionPool,
  upsertQuestion,
} from '@/lib/repositories/question-pool-repository';
import type { Question } from '@/lib/types';

export function AdminQuestionTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editing, setEditing] = useState<Question | undefined>();
  const [formOpen, setFormOpen] = useState(false);

  const reload = useCallback(() => setQuestions(getQuestionPool()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{questions.length} questions</p>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add question
        </Button>
      </div>
      <div className="border border-border rounded-lg bg-card overflow-x-auto max-h-[70vh]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, i) => (
              <TableRow key={q.question_id} className={i % 2 === 1 ? 'bg-muted/40' : undefined}>
                <TableCell className="font-mono text-xs">{q.question_id}</TableCell>
                <TableCell className="max-w-xs truncate">{q.question_text}</TableCell>
                <TableCell>{q.skills.join(', ')}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      q.status === 'approved'
                        ? 'default'
                        : q.status === 'draft'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {q.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(q);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteQuestion(q.question_id);
                        reload();
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <QuestionForm
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(undefined);
        }}
        initial={editing}
        onSave={(q) => {
          upsertQuestion(q);
          reload();
        }}
      />
    </>
  );
}
