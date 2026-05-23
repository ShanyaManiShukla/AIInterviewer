/** Maps legacy slugs to canonical catalog slugs (shared by filters and generation). */
const SKILL_ALIASES: Record<string, string> = {
  react: 'react-js',
  'react.js': 'react-js',
  node: 'nodejs',
  'node.js': 'nodejs',
  'system design': 'system-design',
  'data structures': 'data-structures',
  'state management': 'state-management',
  'database indexing': 'database-indexing',
  'backend apis': 'backend-apis',
  'object-oriented programming': 'oop',
  git: 'git-github',
  'git & github': 'git-github',
  security: 'security-basics',
  'security basics': 'security-basics',
  performance: 'performance-optimization',
  cloud: 'cloud-basics',
};

export function normalizeSkillSlugForFilter(slug: string): string {
  const key = slug.toLowerCase().trim();
  const hyphenated = key.replace(/\s+/g, '-').replace(/\.js$/, '-js');
  return SKILL_ALIASES[key] ?? SKILL_ALIASES[hyphenated] ?? hyphenated;
}
