'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { getSkillBySlug, getTopicsBySkill } from '@/lib/repositories/catalog-repository';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { createInterviewRun } from '@/lib/services/interview-run-service';
import { createPracticeSession } from '@/lib/services/session-service';
import { QuestionGenerationError } from '@/lib/services/question-service';
import type { GenerationConfig, GenerationMode } from '@/lib/types';

const defaultConfig: Partial<GenerationConfig> = {
  skill: 'javascript',
  topic: 'closures',
  difficulty: 'intermediate',
  question_count: 3,
  question_types: ['conceptual', 'coding', 'scenario'],
  generation_mode: 'curated',
  include_model_answers: true,
  include_rubrics: true,
  time_per_question_minutes: 5,
};

export function QuestionWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<Partial<GenerationConfig>>(defaultConfig);
  const [startMode, setStartMode] = useState<'practice' | 'mock'>('practice');
  const [loading, setLoading] = useState(false);

  const patch = (p: Partial<GenerationConfig>) =>
    setConfig((c) => ({ ...c, ...p }));

  const handleGenerate = () => {
    if (!config.skill || !config.difficulty) {
      toast.error('Please select skill and difficulty.');
      return;
    }
    setLoading(true);
    try {
      const fullConfig: GenerationConfig = {
        skill: config.skill,
        topic: config.topic === 'all' ? '' : config.topic ?? '',
        difficulty: config.difficulty,
        question_count: config.question_count ?? 3,
        question_types:
          (config.question_types?.length ?? 0) > 0
            ? config.question_types!
            : ['conceptual'],
        generation_mode: config.generation_mode ?? 'curated',
        include_model_answers: true,
        include_rubrics: true,
        time_per_question_minutes: config.time_per_question_minutes ?? 5,
      };

      const session = createPracticeSession(fullConfig);
      if (startMode === 'mock') {
        const run = createInterviewRun(
          session.session_id,
          fullConfig.time_per_question_minutes ?? 5
        );
        router.push(`/interview/${run.run_id}`);
      } else {
        router.push(`/sessions/${session.session_id}`);
      }
    } catch (err) {
      const msg =
        err instanceof QuestionGenerationError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Generation failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Filters', 'Options', 'Mode'];
  const selectedSkill = config.skill ? getSkillBySlug(config.skill) : undefined;
  const topicCount = config.skill ? getTopicsBySkill(config.skill).length : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex gap-2 mb-2">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`h-2 rounded-full mb-1 ${
                i <= step ? 'bg-accent' : 'bg-muted'
              }`}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
        <motion.div
          key="step0"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>Choose your focus</CardTitle>
            <CardDescription>
              Skill, topic, difficulty, and question types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSkill?.interview_focus && (
              <p className="text-sm text-muted-foreground mb-4 p-3 rounded-md bg-muted">
                <span className="font-medium text-foreground">Focus: </span>
                {selectedSkill.interview_focus}
                <span className="block mt-1 text-xs">{topicCount} topics available</span>
              </p>
            )}
            <QuestionFilters config={config} onChange={patch} />
            <Button className="mt-6 w-full bg-primary" onClick={() => setStep(1)}>
              Next
            </Button>
          </CardContent>
        </Card>
        </motion.div>
      )}

        {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>Generation options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Generation mode</Label>
              <Select
                value={config.generation_mode ?? 'curated'}
                onValueChange={(v) =>
                  patch({ generation_mode: v as GenerationMode })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curated">Curated bank only</SelectItem>
                  <SelectItem value="hybrid">Hybrid (pool)</SelectItem>
                  <SelectItem value="ai_only">AI only (pool stub)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Phase 1: all modes select randomly from the local question pool.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Minutes per question (mock interview)</Label>
              <Select
                value={String(config.time_per_question_minutes ?? 5)}
                onValueChange={(v) =>
                  patch({ time_per_question_minutes: parseInt(v, 10) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 10, 15].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

        {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>How do you want to practice?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <button
                type="button"
                className={`text-left border rounded-lg p-4 ${
                  startMode === 'practice'
                    ? 'border-accent bg-accent/10'
                    : 'border-border'
                }`}
                onClick={() => setStartMode('practice')}
              >
                <p className="font-semibold">Practice set</p>
                <p className="text-sm text-muted-foreground">
                  View questions and reveal model answers at your pace
                </p>
              </button>
              <button
                type="button"
                className={`text-left border rounded-lg p-4 ${
                  startMode === 'mock'
                    ? 'border-accent bg-accent/10'
                    : 'border-border'
                }`}
                onClick={() => setStartMode('mock')}
              >
                <p className="font-semibold">Mock interview</p>
                <p className="text-sm text-muted-foreground">
                  Timed questions with instant mock scoring
                </p>
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? 'Generating…' : 'Generate'}
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
