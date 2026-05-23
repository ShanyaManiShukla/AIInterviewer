/**
 * Builds lib/data/catalog-seed.json from question-bank.json + skill-metadata.json
 */
import * as fs from 'fs';
import * as path from 'path';

interface Question {
  skills: string[];
  topic: string;
}

interface SkillMeta {
  slug: string;
  interview_focus: string;
}

const SKILL_NAMES: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
  'react-js': 'React.js',
  'state-management': 'State Management',
  sql: 'SQL',
  'database-indexing': 'Database Indexing',
  'backend-apis': 'Backend APIs',
  'system-design': 'System Design',
  nodejs: 'Node.js',
  oop: 'Object-Oriented Programming',
  'git-github': 'Git & GitHub',
  testing: 'Testing',
  debugging: 'Debugging',
  'cloud-basics': 'Cloud Basics',
  docker: 'Docker',
  'security-basics': 'Security Basics',
  'performance-optimization': 'Performance Optimization',
  collaboration: 'Collaboration',
};

function topicDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/Api/g, 'API')
    .replace(/Dom/g, 'DOM')
    .replace(/Jwt/g, 'JWT')
    .replace(/Oop/g, 'OOP');
}

function main() {
  const root = path.join(__dirname, '..');
  const questions: Question[] = JSON.parse(
    fs.readFileSync(path.join(root, 'lib/data/question-bank.json'), 'utf8')
  );
  const metadata: SkillMeta[] = JSON.parse(
    fs.readFileSync(path.join(root, 'lib/data/skill-metadata.json'), 'utf8')
  );

  const topicsBySkill = new Map<string, Set<string>>();
  for (const q of questions) {
    const skill = q.skills[0];
    if (!skill) continue;
    if (!topicsBySkill.has(skill)) topicsBySkill.set(skill, new Set());
    topicsBySkill.get(skill)!.add(q.topic);
  }

  const skills = metadata.map((m) => ({
    id: `skill-${m.slug}`,
    slug: m.slug,
    name: SKILL_NAMES[m.slug] ?? m.slug,
    interview_focus: m.interview_focus,
    active: true,
  }));

  const topics = skills.flatMap((skill) => {
    const topicSlugs = topicsBySkill.get(skill.slug) ?? new Set();
    return Array.from(topicSlugs).map((slug) => ({
      id: `top-${skill.slug}-${slug}`,
      skill_id: skill.id,
      slug,
      name: topicDisplayName(slug),
      active: true,
    }));
  });

  const catalog = { skills, topics };
  fs.writeFileSync(
    path.join(root, 'lib/data/catalog-seed.json'),
    JSON.stringify(catalog, null, 2)
  );
  console.log(
    `Catalog: ${skills.length} skills, ${topics.length} topics → lib/data/catalog-seed.json`
  );
}

main();
