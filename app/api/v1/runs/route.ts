import { apiError } from '@/lib/api/error';
import { createRunSchema } from '@/lib/schemas/api';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('VALIDATION_ERROR', 'Invalid JSON body', 400);
  }

  const parsed = createRunSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('VALIDATION_ERROR', 'Invalid request', 400, {
      issues: parsed.error.flatten(),
    });
  }

  return Response.json({
    run_id: `run_${crypto.randomUUID()}`,
    session_id: parsed.data.session_id,
    state: 'countdown',
    timer_seconds_per_question: (parsed.data.timer_minutes ?? 5) * 60,
  });
}
