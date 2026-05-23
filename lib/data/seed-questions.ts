import { makeQuestion } from '@/lib/data/seed-question-builder';
import type { Question } from '@/lib/types';

export { QUESTION_POOL_SEED_VERSION } from '@/lib/data/catalog-definitions';

/** Curated bank: at least one approved question per skill (20 skills). */
export const SEED_QUESTIONS: Question[] = [
  makeQuestion('js-clo-001', {
    skill: 'javascript',
    topic: 'closures',
    text: 'Explain what a JavaScript closure is and describe one practical use case in production code.',
    outline: ['Definition', 'Lexical scope', 'Practical use case'],
    answer: {
      summary:
        'A closure is a function that retains access to variables from its lexical scope after the outer function returns.',
      key_points: ['Module pattern', 'Event handlers', 'Memoization'],
    },
    tags: ['closures'],
  }),
  makeQuestion('js-async-002', {
    skill: 'javascript',
    topic: 'async',
    type: 'scenario',
    text: 'Compare async/await with raw Promise chains. When is each preferable?',
    outline: ['Readability', 'Error handling', 'Parallelism with Promise.all'],
    answer: {
      summary: 'Async/await improves sequential flow; Promise.all fits parallel independent tasks.',
      key_points: ['try/catch vs .catch', 'Avoid await in loops for parallel work'],
    },
  }),
  makeQuestion('js-prom-003', {
    skill: 'javascript',
    topic: 'promises',
    type: 'scenario',
    text: 'Compare Promise.all and Promise.allSettled. When would you choose each?',
    outline: ['Fail-fast vs settle-all', 'Aggregation use cases', 'Error handling'],
    answer: {
      summary: 'Promise.all fails on first rejection; allSettled reports every outcome.',
      key_points: ['Dependent batch vs health checks', 'Partial results'],
    },
  }),
  makeQuestion('js-loop-004', {
    skill: 'javascript',
    topic: 'event-loop',
    text: 'Explain the JavaScript event loop and how microtasks differ from macrotasks.',
    outline: ['Call stack', 'Task queue', 'Microtask queue', 'Order of execution'],
    answer: {
      summary: 'The event loop processes the stack, then microtasks (promises), then macrotasks (timers).',
      key_points: ['Promise callbacks before setTimeout', 'Avoid blocking the main thread'],
    },
  }),
  makeQuestion('py-dec-005', {
    skill: 'python',
    topic: 'decorators',
    text: 'Explain what a Python decorator is and describe one practical use case.',
    outline: ['Callable wrapper', '@ syntax', 'Use case'],
    answer: {
      summary: 'A decorator wraps a function to add behavior without changing its source.',
      key_points: ['Logging', 'Auth checks', 'Caching'],
    },
  }),
  makeQuestion('py-oop-006', {
    skill: 'python',
    topic: 'oop',
    text: 'Explain encapsulation, inheritance, and polymorphism with a short Python example.',
    outline: ['Three pillars', 'Example class design', 'When to favor composition'],
    answer: {
      summary: 'OOP groups data and behavior; prefer composition when inheritance hierarchies grow deep.',
      key_points: ['Private attributes by convention', 'Method overriding', 'Duck typing'],
    },
  }),
  makeQuestion('py-exc-007', {
    skill: 'python',
    topic: 'exceptions',
    text: 'How do you design exception handling for a data import pipeline?',
    outline: ['Specific exceptions', 'Logging context', 'Retry vs fail'],
    answer: {
      summary: 'Catch specific errors, log with context, and separate recoverable vs fatal failures.',
      key_points: ['Custom exception types', 'finally for cleanup', 'Avoid bare except'],
    },
  }),
  makeQuestion('py-data-008', {
    skill: 'python',
    topic: 'data-handling',
    type: 'coding',
    text: 'When would you use a list comprehension vs a generator expression for large datasets?',
    outline: ['Memory footprint', 'Laziness', 'Readability tradeoffs'],
    answer: {
      summary: 'Generators stream items lazily; list comprehensions materialize everything in memory.',
      key_points: ['Large files', 'Pipeline processing', 'sum(x for x in ...) pattern'],
    },
  }),
  makeQuestion('ds-ll-009', {
    skill: 'data-structures',
    topic: 'linked-lists',
    type: 'coding',
    text: 'Detect a cycle in a linked list. What are the time and space complexities?',
    outline: ['Floyd algorithm', 'Hash set alternative', 'Complexity'],
    answer: {
      summary: 'Two pointers (slow/fast) detect cycles in O(n) time and O(1) space.',
      key_points: ['Empty list edge case', 'Why fast moves 2 steps'],
    },
  }),
  makeQuestion('ds-stack-010', {
    skill: 'data-structures',
    topic: 'stacks',
    text: 'Describe a real problem where a stack is the natural data structure.',
    outline: ['LIFO property', 'Example problem', 'Complexity'],
    answer: {
      summary: 'Stacks suit nested structures: parsing, undo/redo, DFS iterative traversal.',
      key_points: ['Bracket matching', 'Call stack analogy'],
    },
  }),
  makeQuestion('algo-sort-011', {
    skill: 'algorithms',
    topic: 'sorting',
    text: 'Compare merge sort and quicksort. When would you pick each?',
    outline: ['Time/space', 'Stability', 'Worst case'],
    answer: {
      summary: 'Merge sort guarantees O(n log n) and stability; quicksort is often faster in practice on arrays.',
      key_points: ['Pivot selection', 'External sorting use case'],
    },
  }),
  makeQuestion('algo-comp-012', {
    skill: 'algorithms',
    topic: 'complexity',
    text: 'What is Big-O notation and why does it matter in interviews?',
    outline: ['Definition', 'Common classes', 'Tradeoffs with constants'],
    answer: {
      summary: 'Big-O describes growth rate of resource use as input size increases.',
      key_points: ['O(1), O(log n), O(n), O(n log n)', 'Space vs time'],
    },
  }),
  makeQuestion('react-hooks-013', {
    skill: 'react-js',
    topic: 'hooks',
    difficulty: 'beginner',
    text: 'Explain the rules of Hooks in React and why they exist.',
    outline: ['Top-level only', 'React functions only', 'Consistent order'],
    answer: {
      summary: 'Hooks must run in the same order every render so React can match state to calls.',
      key_points: ['No hooks in loops/conditions', 'Custom hooks reuse logic'],
    },
  }),
  makeQuestion('react-render-014', {
    skill: 'react-js',
    topic: 'rendering',
    text: 'What causes unnecessary re-renders in React and how do you reduce them?',
    outline: ['State/props changes', 'memo/useMemo/useCallback', 'Context pitfalls'],
    answer: {
      summary: 'Re-renders follow state updates; memoize expensive children and split context.',
      key_points: ['React DevTools Profiler', 'Key prop on lists'],
    },
  }),
  makeQuestion('sm-redux-015', {
    skill: 'state-management',
    topic: 'redux',
    type: 'scenario',
    text: 'When would you choose Redux Toolkit vs React Context for global state?',
    outline: ['Update frequency', 'DevTools', 'Middleware needs'],
    answer: {
      summary: 'Redux fits complex shared state with predictable updates; Context fits low-churn globals.',
      key_points: ['RTK slices', 'Avoid context for high-frequency updates'],
    },
  }),
  makeQuestion('sql-join-016', {
    skill: 'sql',
    topic: 'joins',
    type: 'coding',
    text: 'Write a query for customers with orders in the last 30 days but no product reviews.',
    outline: ['Date filter', 'Anti-join', 'DISTINCT'],
    answer: {
      summary: 'Use EXISTS for recent orders and NOT EXISTS for missing reviews.',
      key_points: ['LEFT JOIN ... IS NULL pattern', 'Timezone awareness'],
    },
  }),
  makeQuestion('sql-grp-017', {
    skill: 'sql',
    topic: 'grouping',
    text: 'Explain GROUP BY and HAVING with an example aggregation query.',
    outline: ['GROUP BY columns', 'HAVING vs WHERE', 'Aggregate functions'],
    answer: {
      summary: 'GROUP BY collapses rows; HAVING filters groups after aggregation.',
      key_points: ['COUNT/SUM/AVG', 'Non-aggregated columns in SELECT rules'],
    },
  }),
  makeQuestion('db-idx-018', {
    skill: 'database-indexing',
    topic: 'indexes',
    text: 'How do B-tree indexes improve reads, and when can they hurt writes?',
    outline: ['Lookup cost', 'Selectivity', 'Write amplification'],
    answer: {
      summary: 'Indexes speed selective lookups but add maintenance on INSERT/UPDATE/DELETE.',
      key_points: ['Covering indexes', 'Low-cardinality caution'],
    },
  }),
  makeQuestion('api-rest-019', {
    skill: 'backend-apis',
    topic: 'rest',
    text: 'Design REST endpoints for a todo app. Which HTTP methods and status codes apply?',
    outline: ['Resource naming', 'Idempotency', 'Status codes'],
    answer: {
      summary: 'Use nouns for resources, correct verbs (GET/POST/PUT/PATCH/DELETE), and meaningful status codes.',
      key_points: ['201 on create', '404 vs 400', 'Pagination query params'],
    },
  }),
  makeQuestion('sd-scale-020', {
    skill: 'system-design',
    topic: 'scaling',
    type: 'scenario',
    difficulty: 'advanced',
    text: 'Design a URL shortener for 10k writes/sec. What are the core components?',
    outline: ['API tier', 'ID generation', 'Storage', 'Caching'],
    answer: {
      summary: 'Stateless API, distributed IDs, KV store, CDN cache for redirects.',
      key_points: ['Shard by key prefix', 'Read-heavy optimization'],
    },
  }),
  makeQuestion('node-loop-021', {
    skill: 'nodejs',
    topic: 'event-loop',
    text: 'How does the Node.js event loop differ from the browser event loop?',
    outline: ['libuv phases', 'I/O bound work', 'Non-blocking patterns'],
    answer: {
      summary: 'Node uses libuv phases for I/O; both use microtasks for promises.',
      key_points: ['Worker threads for CPU work', 'Avoid blocking the loop'],
    },
  }),
  makeQuestion('oop-inh-022', {
    skill: 'oop',
    topic: 'inheritance',
    text: 'Explain inheritance vs composition. When do you favor composition?',
    outline: ['IS-A vs HAS-A', 'Fragile base class', 'Example'],
    answer: {
      summary: 'Composition reduces tight coupling when behavior combinations vary.',
      key_points: ['Favor composition for flexibility', 'Interface segregation'],
    },
  }),
  makeQuestion('git-branch-023', {
    skill: 'git-github',
    topic: 'branching',
    text: 'Describe a Git branching strategy for a small team shipping weekly.',
    outline: ['Main branch', 'Feature branches', 'PR reviews'],
    answer: {
      summary: 'Trunk-based or GitHub flow with short-lived feature branches and PR checks.',
      key_points: ['Rebase vs merge', 'Protected main'],
    },
  }),
  makeQuestion('test-unit-024', {
    skill: 'testing',
    topic: 'unit-tests',
    text: 'What belongs in a unit test vs an integration test for an API service?',
    outline: ['Isolation', 'Mocks', 'Boundaries'],
    answer: {
      summary: 'Unit tests verify pure logic in isolation; integration tests hit real DB/HTTP boundaries.',
      key_points: ['Arrange-Act-Assert', 'Test pyramid'],
    },
  }),
  makeQuestion('debug-rca-025', {
    skill: 'debugging',
    topic: 'root-cause-analysis',
    text: 'Walk through how you would debug a production issue causing 500 errors.',
    outline: ['Reproduce', 'Logs/metrics', 'Hypothesis', 'Fix and verify'],
    answer: {
      summary: 'Triage severity, find correlation in logs, isolate change, fix with rollback plan.',
      key_points: ['Structured logging', 'Postmortem without blame'],
    },
  }),
  makeQuestion('cloud-deploy-026', {
    skill: 'cloud-basics',
    topic: 'deployment',
    text: 'What are the basic steps to deploy a containerized web app to the cloud?',
    outline: ['Build image', 'Registry', 'Runtime service', 'Env config'],
    answer: {
      summary: 'Build, push image, deploy to managed runtime, configure secrets and health checks.',
      key_points: ['Blue/green or rolling deploy', 'HTTPS termination'],
    },
  }),
  makeQuestion('docker-vol-027', {
    skill: 'docker',
    topic: 'volumes',
    text: 'Explain Docker volumes vs bind mounts. When do you use each?',
    outline: ['Persistence', 'Portability', 'Dev vs prod'],
    answer: {
      summary: 'Volumes are managed by Docker for portable persistence; bind mounts map host paths for dev.',
      key_points: ['Named volumes for DB data', 'Avoid bind mounts in prod'],
    },
  }),
  makeQuestion('sec-jwt-028', {
    skill: 'security-basics',
    topic: 'jwt',
    text: 'How do JWT access tokens work and what are common security pitfalls?',
    outline: ['Claims', 'Signature', 'Storage', 'Expiry/refresh'],
    answer: {
      summary: 'JWTs are signed claims; store securely, keep TTL short, use HTTPS, validate issuer/audience.',
      key_points: ['HttpOnly cookies vs localStorage', 'Rotation on refresh'],
    },
  }),
  makeQuestion('perf-cache-029', {
    skill: 'performance-optimization',
    topic: 'caching',
    text: 'Describe cache layers you would add to a read-heavy API.',
    outline: ['Client CDN', 'Application cache', 'Database', 'Invalidation'],
    answer: {
      summary: 'Layer caches from CDN to in-memory to DB; define TTL and invalidation on writes.',
      key_points: ['Cache-aside pattern', 'Stampede protection'],
    },
  }),
  makeQuestion('collab-030', {
    skill: 'collaboration',
    topic: 'teamwork',
    type: 'behavioral',
    difficulty: 'beginner',
    text: 'Tell me about a time you disagreed with a teammate on a technical decision. How did you resolve it?',
    outline: ['STAR format', 'Data-driven resolution', 'Outcome'],
    answer: {
      summary: 'Focus on shared goals, use experiments and criteria, document the decision.',
      key_points: ['Empathy', 'Prototype to compare', 'Follow up'],
    },
    tags: ['behavioral'],
  }),
];
