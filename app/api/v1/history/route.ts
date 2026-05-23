import { apiError } from '@/lib/api/error';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return apiError(
      'UNAUTHORIZED',
      'Authorization header required for history in API mode',
      401
    );
  }
  return Response.json({
    sessions: [],
    message: 'Use client localStorage history in Phase 1',
  });
}
