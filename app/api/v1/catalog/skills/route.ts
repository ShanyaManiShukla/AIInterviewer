import { SEED_CATALOG } from '@/lib/data/seed-catalog';

export async function GET() {
  return Response.json({
    skills: SEED_CATALOG.skills.filter((s) => s.active),
  });
}
