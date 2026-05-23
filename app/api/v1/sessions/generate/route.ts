import { QUESTION_BANK } from '@/lib/data/question-bank';
import { apiError } from '@/lib/api/error';
import { generationRequestSchema } from '@/lib/schemas/api';
import {
  QuestionGenerationError,
  selectRandomQuestions,
} from '@/lib/services/question-service';
import type { GenerationConfig } from '@/lib/types';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Invalid JSON body', 400);
  }

  const parsed = generationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid request', 400, {
      issues: parsed.error.flatten(),
    });
  }

  const data = parsed.data;
  const config: GenerationConfig = {
    skill: data.skill,
    topic: data.topic ?? '',
    difficulty: data.difficulty,
    question_count: data.question_count,
    question_types: data.question_types ?? ['conceptual'],
    generation_mode: data.generation_mode ?? 'curated',
    include_model_answers: data.include_model_answers ?? true,
    include_rubrics: data.include_rubrics ?? true,
  };

  try {
    const questions = selectRandomQuestions(QUESTION_BANK, config);
    return Response.json({
      session_id: `sess_${crypto.randomUUID()}`,
      provider: 'mock',
      model: 'placeholder-v1',
      questions: questions.map((sq) => ({
        sequence: sq.sequence,
        question_text: sq.question.question_text,
        question_type: sq.question.question_type,
        difficulty: sq.question.difficulty,
        topic: sq.question.topic,
        skills: sq.question.skills,
        source_type: 'curated',
        expected_answer_outline: sq.question.expected_answer_outline,
        rubric: sq.question.rubric,
        model_answer: config.include_model_answers
          ? sq.question.model_answer
          : undefined,
      })),
    });
  } catch (err) {
    if (err instanceof QuestionGenerationError) {
      return apiError(err.code, err.message, 400);
    }
    return apiError('VALIDATION_ERROR', 'Generation failed', 500);
  }
}
