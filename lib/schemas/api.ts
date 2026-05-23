import { z } from 'zod';

export const generationRequestSchema = z.object({
  skill: z.string().min(1),
  topic: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  question_count: z.number().int().min(1).max(25),
  question_types: z
    .array(
      z.enum(['conceptual', 'coding', 'debugging', 'scenario', 'behavioral'])
    )
    .optional(),
  generation_mode: z.enum(['curated', 'hybrid', 'ai_only']).optional(),
  include_model_answers: z.boolean().optional(),
  include_rubrics: z.boolean().optional(),
});

export const scoreRequestSchema = z.object({
  question_text: z.string().min(1),
  answer_text: z.string(),
  rubric: z.object({
    dimensions: z.array(
      z.object({
        name: z.string(),
        weight: z.number(),
      })
    ),
    max_score: z.number(),
  }),
});

export const createRunSchema = z.object({
  session_id: z.string().min(1),
  timer_minutes: z.number().int().min(1).max(60).optional(),
});

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>
) {
  return Response.json(
    { error: { code, message, details: details ?? {} } },
    { status }
  );
}
