export type UserRole = 'student' | 'admin' | 'reviewer';

export type QuestionType =
  | 'conceptual'
  | 'coding'
  | 'debugging'
  | 'scenario'
  | 'behavioral';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionStatus = 'draft' | 'approved' | 'archived';

export type SourceType = 'curated' | 'hybrid' | 'ai_generated';

export type GenerationMode = 'curated' | 'hybrid' | 'ai_only';

export type RunState =
  | 'idle'
  | 'countdown'
  | 'asking'
  | 'answering'
  | 'submitted'
  | 'scoring'
  | 'next'
  | 'complete';

export interface RubricDimension {
  name: string;
  weight: number;
}

export interface Rubric {
  dimensions: RubricDimension[];
  max_score: number;
}

export interface ModelAnswer {
  summary: string;
  key_points: string[];
  common_mistakes?: string[];
}

export interface Question {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  skills: string[];
  expected_answer_outline: string[];
  rubric: Rubric;
  model_answer: ModelAnswer;
  source_type: SourceType;
  status: QuestionStatus;
  tags?: string[];
}

export interface Skill {
  id: string;
  slug: string;
  name: string;
  interview_focus?: string;
  active: boolean;
}

export interface Topic {
  id: string;
  skill_id: string;
  slug: string;
  name: string;
  active: boolean;
}

export interface Catalog {
  skills: Skill[];
  topics: Topic[];
}

export interface GenerationConfig {
  skill: string;
  topic: string;
  difficulty: Difficulty;
  question_count: number;
  question_types: QuestionType[];
  generation_mode: GenerationMode;
  include_model_answers: boolean;
  include_rubrics: boolean;
  time_per_question_minutes?: number;
}

export interface SessionQuestion {
  sequence: number;
  question: Question;
}

export interface PracticeSession {
  session_id: string;
  user_id: string;
  config: GenerationConfig;
  questions: SessionQuestion[];
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthState {
  user: User;
  accessToken: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  max_score: number;
  feedback: string;
}

export interface Scorecard {
  overall_score: number;
  dimension_scores: DimensionScore[];
  strengths: string[];
  gaps: string[];
  follow_up_question: string;
  evidence_spans: string[];
  reviewer_notes?: string;
}

export interface Answer {
  session_question_sequence: number;
  answer_text: string;
  submitted_at: string;
}

export interface ScoredAnswer extends Answer {
  scorecard: Scorecard;
}

export interface InterviewRun {
  run_id: string;
  session_id: string;
  user_id: string;
  state: RunState;
  current_question_index: number;
  timer_seconds_per_question: number;
  answers: ScoredAnswer[];
  draft_answer?: string;
  started_at: string;
  completed_at?: string;
}

export interface HistoryEntry {
  session_id: string;
  run_id?: string;
  skill: string;
  topic: string;
  difficulty: Difficulty;
  question_count: number;
  average_score?: number;
  created_at: string;
  completed: boolean;
}
