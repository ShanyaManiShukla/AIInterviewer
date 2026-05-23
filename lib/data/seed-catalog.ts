import catalogSeed from '@/lib/data/catalog-seed.json';
import type { Catalog } from '@/lib/types';

export const CATALOG_SEED_VERSION = 3;

export const SEED_CATALOG: Catalog = catalogSeed as Catalog;
