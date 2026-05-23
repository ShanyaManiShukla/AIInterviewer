import { QUESTION_BANK } from '@/lib/data/question-bank';
import { apiError } from '@/lib/api/error';
import { scoreRequestSchema } from '@/lib/schemas/api';
import { mockScoreAnswer } from '@/lib/services/scoring-service';
import type { Question } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  void params.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Invalid JSON body', 400);
  }

  const parsed = scoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid request', 400, {
      issues: parsed.error.flatten(),
    });
  }

  const stubQuestion: Question =
    QUESTION_BANK.find(
      (q) => q.question_text === parsed.data.question_text
    ) ?? {
      question_id: 'stub',
      question_text: parsed.data.question_text,
      question_type: 'conceptual',
      difficulty: 'intermediate',
      topic: 'general',
      skills: ['general'],
      expected_answer_outline: [],
      rubric: parsed.data.rubric,
      model_answer: { summary: '', key_points: [] },
      source_type: 'curated',
      status: 'approved',
    };

  const scorecard = mockScoreAnswer(stubQuestion, parsed.data.answer_text);
  return Response.json({ scorecard });
}
