import { SEED_CATALOG } from '@/lib/data/seed-catalog';
import { apiError } from '@/lib/api/error';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get('skill');
  if (!skill) {
    return apiError('VALIDATION_ERROR', 'skill query parameter is required', 400);
  }
  const skillRow = SEED_CATALOG.skills.find((s) => s.slug === skill);
  if (!skillRow) {
    return apiError('NOT_FOUND', 'Unknown skill', 404);
  }
  const topics = SEED_CATALOG.topics.filter(
    (t) => t.skill_id === skillRow.id && t.active
  );
  return Response.json({ topics });
}
