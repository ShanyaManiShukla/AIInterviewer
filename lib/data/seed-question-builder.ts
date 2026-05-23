import type {
  Difficulty,
  ModelAnswer,
  Question,
  QuestionType,
  Rubric,
} from '@/lib/types';

const defaultRubric: Rubric = {
  dimensions: [
    { name: 'accuracy', weight: 0.4 },
    { name: 'depth', weight: 0.35 },
    { name: 'clarity', weight: 0.25 },
  ],
  max_score: 100,
};

export function makeQuestion(
  id: string,
  opts: {
    text: string;
    skill: string;
    topic: string;
    type?: QuestionType;
    difficulty?: Difficulty;
    outline: string[];
    answer: ModelAnswer;
    rubric?: Rubric;
    tags?: string[];
  }
): Question {
  return {
    question_id: id,
    question_text: opts.text,
    question_type: opts.type ?? 'conceptual',
    difficulty: opts.difficulty ?? 'intermediate',
    topic: opts.topic,
    skills: [opts.skill],
    expected_answer_outline: opts.outline,
    rubric: opts.rubric ?? defaultRubric,
    model_answer: opts.answer,
    source_type: 'curated',
    status: 'approved',
    tags: opts.tags,
  };
}
