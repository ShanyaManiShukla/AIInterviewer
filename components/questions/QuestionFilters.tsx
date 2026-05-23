'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  getSkillBySlug,
  getSkills,
  getTopicsBySkill,
} from '@/lib/repositories/catalog-repository';
import { QUESTION_TYPES } from '@/lib/services/question-service';
import type { Difficulty, GenerationConfig, QuestionType } from '@/lib/types';

interface QuestionFiltersProps {
  config: Partial<GenerationConfig>;
  onChange: (patch: Partial<GenerationConfig>) => void;
}

export function QuestionFilters({ config, onChange }: QuestionFiltersProps) {
  const skills = getSkills();
  const selectedSkill = config.skill ? getSkillBySlug(config.skill) : undefined;
  const topics = config.skill ? getTopicsBySkill(config.skill) : [];

  const toggleType = (type: QuestionType, checked: boolean) => {
    const current = config.question_types ?? [];
    const next = checked
      ? [...current, type]
      : current.filter((t) => t !== type);
    onChange({ question_types: next });
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Skill</Label>
          <Select
            value={config.skill ?? ''}
            onValueChange={(v) =>
              onChange({ skill: v, topic: '' })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((s) => (
                <SelectItem key={s.id} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSkill?.interview_focus && (
            <p className="text-xs text-muted-foreground">
              Focus: {selectedSkill.interview_focus}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Topic</Label>
          <Select
            value={config.topic ?? ''}
            onValueChange={(v) => onChange({ topic: v })}
            disabled={!config.skill}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={config.difficulty ?? ''}
            onValueChange={(v) =>
              onChange({ difficulty: v as Difficulty })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Question count</Label>
          <Select
            value={String(config.question_count ?? 3)}
            onValueChange={(v) =>
              onChange({ question_count: parseInt(v, 10) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Question types</Label>
        <div className="flex flex-wrap gap-4">
          {QUESTION_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={(config.question_types ?? []).includes(type)}
                onCheckedChange={(c) => toggleType(type, c === true)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
