import { CATALOG_SEED_VERSION, SEED_CATALOG } from '@/lib/data/seed-catalog';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, setItem } from '@/lib/storage/local-storage';
import type { Catalog, Skill, Topic } from '@/lib/types';

export function initCatalog(): Catalog {
  const version = getItem<number>(STORAGE_KEYS.catalogVersion, 0);
  if (version < CATALOG_SEED_VERSION) {
    setItem(STORAGE_KEYS.catalog, SEED_CATALOG);
    setItem(STORAGE_KEYS.catalogVersion, CATALOG_SEED_VERSION);
    return SEED_CATALOG;
  }
  const existing = getItem<Catalog | null>(STORAGE_KEYS.catalog, null);
  if (existing && existing.skills.length > 0) return existing;
  setItem(STORAGE_KEYS.catalog, SEED_CATALOG);
  setItem(STORAGE_KEYS.catalogVersion, CATALOG_SEED_VERSION);
  return SEED_CATALOG;
}

export function getCatalog(): Catalog {
  return initCatalog();
}

export function saveCatalog(catalog: Catalog): void {
  setItem(STORAGE_KEYS.catalog, catalog);
}

export function getSkills(): Skill[] {
  return getCatalog().skills.filter((s) => s.active);
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return getSkills().find((s) => s.slug === slug);
}

export function getTopicsBySkill(skillSlug: string): Topic[] {
  const catalog = getCatalog();
  const skill = catalog.skills.find((s) => s.slug === skillSlug);
  if (!skill) return [];
  return catalog.topics.filter((t) => t.skill_id === skill.id && t.active);
}

export function upsertSkill(skill: Skill): void {
  const catalog = getCatalog();
  const idx = catalog.skills.findIndex((s) => s.id === skill.id);
  if (idx >= 0) catalog.skills[idx] = skill;
  else catalog.skills.push(skill);
  saveCatalog(catalog);
}

export function upsertTopic(topic: Topic): void {
  const catalog = getCatalog();
  const idx = catalog.topics.findIndex((t) => t.id === topic.id);
  if (idx >= 0) catalog.topics[idx] = topic;
  else catalog.topics.push(topic);
  saveCatalog(catalog);
}

export function deleteSkill(id: string): void {
  const catalog = getCatalog();
  catalog.skills = catalog.skills.filter((s) => s.id !== id);
  catalog.topics = catalog.topics.filter((t) => t.skill_id !== id);
  saveCatalog(catalog);
}

export function deleteTopic(id: string): void {
  const catalog = getCatalog();
  catalog.topics = catalog.topics.filter((t) => t.id !== id);
  saveCatalog(catalog);
}
