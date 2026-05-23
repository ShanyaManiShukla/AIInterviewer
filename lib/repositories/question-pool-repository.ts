import { QUESTION_POOL_SEED_VERSION } from '@/lib/data/catalog-definitions';
import { QUESTION_BANK } from '@/lib/data/question-bank';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getItem, setItem } from '@/lib/storage/local-storage';
import type { Question } from '@/lib/types';

let memoryCache: Question[] | null = null;

function getOverrides(): Record<string, Question> {
  return getItem<Record<string, Question>>(STORAGE_KEYS.questionOverrides, {});
}

function saveOverrides(overrides: Record<string, Question>): void {
  setItem(STORAGE_KEYS.questionOverrides, overrides);
}

function mergeBankWithOverrides(): Question[] {
  const overrides = getOverrides();
  const byId = new Map<string, Question>();
  for (const q of QUESTION_BANK) {
    byId.set(q.question_id, q);
  }
  for (const [id, q] of Object.entries(overrides)) {
    byId.set(id, q);
  }
  return Array.from(byId.values());
}

export function initQuestionPool(): Question[] {
  const version = getItem<number>(STORAGE_KEYS.questionPoolVersion, 0);
  if (version < QUESTION_POOL_SEED_VERSION) {
    setItem(STORAGE_KEYS.questionPoolVersion, QUESTION_POOL_SEED_VERSION);
    memoryCache = mergeBankWithOverrides();
    return memoryCache;
  }
  if (!memoryCache) {
    memoryCache = mergeBankWithOverrides();
  }
  return memoryCache;
}

export function getQuestionPool(): Question[] {
  return initQuestionPool();
}

export function saveQuestionPool(_questions: Question[]): void {
  memoryCache = mergeBankWithOverrides();
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestionPool().find((q) => q.question_id === id);
}

export function upsertQuestion(question: Question): void {
  const overrides = getOverrides();
  overrides[question.question_id] = question;
  saveOverrides(overrides);
  memoryCache = mergeBankWithOverrides();
}

export function deleteQuestion(id: string): void {
  const overrides = getOverrides();
  delete overrides[id];
  saveOverrides(overrides);
  memoryCache = mergeBankWithOverrides();
}
