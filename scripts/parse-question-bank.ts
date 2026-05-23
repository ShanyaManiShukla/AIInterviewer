/**
 * Parses AI_Interview_Question_Generator_Question_Bank.docx → lib/data/question-bank.json
 * Run: npm run build:bank
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

type QuestionType =
  | 'conceptual'
  | 'coding'
  | 'debugging'
  | 'scenario'
  | 'behavioral';

interface ParsedQuestion {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  skills: string[];
  expected_answer_outline: string[];
  rubric: {
    dimensions: { name: string; weight: number }[];
    max_score: number;
  };
  model_answer: {
    summary: string;
    key_points: string[];
  };
  source_type: 'curated';
  status: 'approved';
}

const SKILL_SLUG_MAP: Record<string, string> = {
  JavaScript: 'javascript',
  Python: 'python',
  'Data Structures': 'data-structures',
  Algorithms: 'algorithms',
  'React.js': 'react-js',
  'State Management': 'state-management',
  SQL: 'sql',
  'Database Indexing': 'database-indexing',
  'Backend APIs': 'backend-apis',
  'System Design': 'system-design',
  'Node.js': 'nodejs',
  'Object-Oriented Programming': 'oop',
  'Git & GitHub': 'git-github',
  Testing: 'testing',
  Debugging: 'debugging',
  'Cloud Basics': 'cloud-basics',
  Docker: 'docker',
  'Security Basics': 'security-basics',
  'Performance Optimization': 'performance-optimization',
  Collaboration: 'collaboration',
};

const SKILL_FOCUS_FROM_DOCX: Record<string, string> = {
  javascript:
    'closures, lexical scope, async/await, promises, event loop',
  python: 'variables and types, functions, OOP, decorators, generators',
  'data-structures':
    'arrays, linked lists, stacks, queues, hash maps',
  algorithms:
    'sorting, searching, binary search, recursion, dynamic programming',
  'react-js': 'components, props, state, hooks, useEffect',
  'state-management':
    'local state, global state, prop drilling, Context API, Redux',
  sql: 'SELECT queries, WHERE filters, GROUP BY, HAVING, INNER JOIN',
  'database-indexing':
    'single-column indexes, composite indexes, unique indexes, covering indexes, B-tree indexes',
  'backend-apis':
    'REST principles, HTTP methods, status codes, request validation, authentication',
  'system-design':
    'requirements gathering, load estimation, database choice, caching, load balancing',
  nodejs: 'event loop, non-blocking I/O, callbacks, promises, async/await',
  oop: 'classes, objects, encapsulation, inheritance, polymorphism',
  'git-github': 'repositories, commits, branches, merge, rebase',
  testing:
    'unit testing, integration testing, end-to-end testing, test cases, assertions',
  debugging:
    'logs, breakpoints, stack traces, reproduction steps, root-cause analysis',
  'cloud-basics':
    'compute, storage, databases, networking, load balancers',
  docker: 'containers, images, Dockerfile, layers, volumes',
  'security-basics':
    'authentication, authorization, password hashing, JWT, sessions',
  'performance-optimization':
    'latency, throughput, caching, database queries, indexing',
  collaboration:
    'communication, code reviews, task ownership, estimation, standups',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapQuestionType(raw: string): QuestionType {
  const t = raw.trim().toLowerCase();
  if (t === 'coding') return 'coding';
  if (t === 'debugging') return 'debugging';
  if (t === 'scenario' || t === 'design' || t === 'optimization') return 'scenario';
  if (t === 'behavioral') return 'behavioral';
  if (t === 'security' || t === 'testing') return 'conceptual';
  return 'conceptual';
}

function mapDifficulty(raw: string): 'beginner' | 'intermediate' | 'advanced' {
  const d = raw.trim().toLowerCase();
  if (d === 'beginner') return 'beginner';
  if (d === 'advanced') return 'advanced';
  return 'intermediate';
}

function skillToSlug(name: string): string {
  return SKILL_SLUG_MAP[name.trim()] ?? slugify(name);
}

function defaultRubric() {
  return {
    dimensions: [
      { name: 'accuracy', weight: 0.4 },
      { name: 'depth', weight: 0.35 },
      { name: 'clarity', weight: 0.25 },
    ],
    max_score: 100,
  };
}

function extractOutline(answer: string): string[] {
  const sentences = answer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  return sentences.slice(0, 3).map((s) =>
    s.length > 120 ? s.slice(0, 117) + '…' : s
  );
}

function extractKeyPoints(answer: string): string[] {
  const points: string[] = [];
  if (answer.includes('definition first')) {
    points.push('Lead with a clear definition');
  }
  if (answer.includes('example')) {
    points.push('Include a practical example');
  }
  if (answer.includes('trade-off')) {
    points.push('Mention trade-offs and limitations');
  }
  if (answer.includes('complexity')) {
    points.push('Discuss time and space complexity where relevant');
  }
  if (answer.includes('reproduce')) {
    points.push('Reproduce the issue with a minimal example');
  }
  if (points.length < 2) {
    points.push('Structure the answer clearly');
    points.push('Connect theory to real project experience');
  }
  return points.slice(0, 4);
}

function parseQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const blocks = text.split(/\n(?=Q\d+\.)/);

  const counters: Record<string, number> = {};

  for (const block of blocks) {
    const qMatch = block.match(/^Q(\d+)\.\s*(.+?)(?=\nSkill:)/s);
    const metaMatch = block.match(
      /Skill:\s*([^|]+)\|\s*Topic:\s*([^|]+)\|\s*Difficulty:\s*([^|]+)\|\s*Type:\s*([^\n]+)/
    );
    const answerMatch = block.match(/Answer:\s*(.+)/s);

    if (!qMatch || !metaMatch || !answerMatch) continue;

    const skillName = metaMatch[1].trim();
    const skillSlug = skillToSlug(skillName);
    const topicName = metaMatch[2].trim();
    const topicSlug = slugify(topicName);
    const difficulty = mapDifficulty(metaMatch[3]);
    const questionType = mapQuestionType(metaMatch[4]);
    const answerText = answerMatch[1].trim().replace(/\s+/g, ' ');

    counters[skillSlug] = (counters[skillSlug] ?? 0) + 1;
    const num = String(counters[skillSlug]).padStart(2, '0');
    const prefix = skillSlug.split('-').map((p) => p[0]).join('').slice(0, 4) || 'q';

    questions.push({
      question_id: `${prefix}-q${num}-${topicSlug}`.slice(0, 48),
      question_text: qMatch[2].trim().replace(/\s+/g, ' '),
      question_type: questionType,
      difficulty,
      topic: topicSlug,
      skills: [skillSlug],
      expected_answer_outline: extractOutline(answerText),
      rubric: defaultRubric(),
      model_answer: {
        summary: answerText.slice(0, 500) + (answerText.length > 500 ? '…' : ''),
        key_points: extractKeyPoints(answerText),
      },
      source_type: 'curated',
      status: 'approved',
    });
  }

  return questions;
}

function main() {
  const root = path.join(__dirname, '..');
  const docxPath = path.join(
    root,
    'AI_Interview_Question_Generator_Question_Bank.docx'
  );
  const outPath = path.join(root, 'lib/data/question-bank.json');
  const metaPath = path.join(root, 'lib/data/skill-metadata.json');

  const text = execSync(`textutil -convert txt -stdout "${docxPath}"`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });

  const questions = parseQuestions(text);

  if (questions.length < 350) {
    console.error(`Expected ~400 questions, parsed ${questions.length}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));

  const metadata = Object.entries(SKILL_FOCUS_FROM_DOCX).map(([slug, focus]) => ({
    slug,
    interview_focus: focus,
  }));
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

  console.log(`Wrote ${questions.length} questions → ${outPath}`);
  console.log(`Wrote skill metadata → ${metaPath}`);
}

main();
