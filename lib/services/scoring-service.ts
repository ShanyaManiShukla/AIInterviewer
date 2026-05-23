import type { Question, Scorecard } from '@/lib/types';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function mockScoreAnswer(
  question: Question,
  answerText: string
): Scorecard {
  const trimmed = answerText.trim();
  const baseScore =
    trimmed.length === 0
      ? 25
      : trimmed.length < 50
        ? 45
        : trimmed.length < 150
          ? 65
          : 78;

  const variance = Math.floor(Math.random() * 11) - 5;
  const overall_score = clamp(baseScore + variance, 0, question.rubric.max_score);

  const dimension_scores = question.rubric.dimensions.map((dim) => {
    const dimScore = clamp(
      Math.round(overall_score * dim.weight + (Math.random() * 10 - 5)),
      0,
      Math.round(question.rubric.max_score * dim.weight)
    );
    return {
      name: dim.name,
      score: dimScore,
      max_score: Math.round(question.rubric.max_score * dim.weight),
      feedback:
        dimScore >= Math.round(question.rubric.max_score * dim.weight) * 0.7
          ? `Strong coverage of ${dim.name.replace(/_/g, ' ')}.`
          : `Could expand on ${dim.name.replace(/_/g, ' ')} with more detail.`,
    };
  });

  const strengths =
    trimmed.length > 0
      ? [
          'You addressed the core topic directly.',
          'Answer structure shows clear intent.',
        ]
      : ['You attempted the question within the time limit.'];

  const gaps =
    trimmed.length < 100
      ? [
          'Provide more depth with examples or step-by-step reasoning.',
          'Reference key terms from the question prompt.',
        ]
      : [
          'Add tradeoffs or edge cases to strengthen senior-level signal.',
          'Tie conclusions back to the rubric dimensions explicitly.',
        ];

  const evidence_spans =
    trimmed.length > 20
      ? [trimmed.slice(0, Math.min(80, trimmed.length)) + (trimmed.length > 80 ? '…' : '')]
      : ['Answer was very brief.'];

  return {
    overall_score,
    dimension_scores,
    strengths,
    gaps,
    follow_up_question: `Can you elaborate on how ${question.topic} applies in a production scenario?`,
    evidence_spans,
    reviewer_notes: 'Mock score — preparatory feedback only, not employment judgment.',
  };
}
