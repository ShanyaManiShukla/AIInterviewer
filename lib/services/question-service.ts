import { getQuestionPool } from '@/lib/repositories/question-pool-repository';
import type {
  GenerationConfig,
  Question,
  QuestionType,
  SessionQuestion,
} from '@/lib/types';

export class QuestionGenerationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

import { normalizeSkillSlugForFilter } from '@/lib/services/skill-utils';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function matchesSkill(q: Question, skillSlug: string): boolean {
  const target = normalizeSkillSlugForFilter(skillSlug);
  return q.skills.some((s) => normalizeSkillSlugForFilter(s) === target);
}

export function filterQuestions(
  pool: Question[],
  config: Pick<
    GenerationConfig,
    'skill' | 'topic' | 'difficulty' | 'question_types'
  >,
  approvedOnly = true
): Question[] {
  return pool.filter((q) => {
    if (approvedOnly && q.status !== 'approved') return false;
    if (!matchesSkill(q, config.skill)) return false;
    if (config.topic && config.topic !== 'all' && q.topic !== config.topic) {
      return false;
    }
    if (q.difficulty !== config.difficulty) return false;
    if (
      config.question_types.length > 0 &&
      !config.question_types.includes(q.question_type)
    ) {
      return false;
    }
    return true;
  });
}

function filterWithFallback(
  pool: Question[],
  config: GenerationConfig
): Question[] {
  let filtered = filterQuestions(pool, config);
  if (filtered.length > 0) return filtered;

  if (config.topic && config.topic !== 'all') {
    filtered = filterQuestions(pool, { ...config, topic: '' });
    if (filtered.length > 0) return filtered;
  }

  filtered = filterQuestions(pool, {
    ...config,
    topic: '',
    question_types: [],
  });
  if (filtered.length > 0) return filtered;

  return filterQuestions(pool, {
    skill: config.skill,
    topic: '',
    difficulty: config.difficulty,
    question_types: [],
  });
}

export function selectRandomQuestions(
  pool: Question[],
  config: GenerationConfig
): SessionQuestion[] {
  const filtered = filterWithFallback(pool, config);
  if (filtered.length === 0) {
    throw new QuestionGenerationError(
      'VALIDATION_ERROR',
      'No questions match your criteria. Try a different skill or loosen topic/difficulty filters.'
    );
  }

  const count = Math.min(config.question_count, filtered.length);
  const selected = shuffle(filtered).slice(0, count);

  return selected.map((question, index) => ({
    sequence: index + 1,
    question,
  }));
}

export function generateQuestionsFromPool(
  config: GenerationConfig
): SessionQuestion[] {
  const pool = getQuestionPool();
  return selectRandomQuestions(pool, config);
}

export const QUESTION_TYPES: QuestionType[] = [
  'conceptual',
  'coding',
  'debugging',
  'scenario',
  'behavioral',
];
