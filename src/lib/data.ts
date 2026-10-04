// src/lib/data.ts
import type { CollectionEntry } from 'astro:content';

type AnimeEntry = CollectionEntry<'anime'>;

export function countByArrayField(
  animeList: AnimeEntry[],
  field: 'genres' | 'studios' | 'franchises'
): Map<string, number> {
  const map = new Map<string, number>();
  for (const anime of animeList) {
    for (const value of anime.data[field]) {
      map.set(value, (map.get(value) ?? 0) + 1);
    }
  }
  return map;
}
export function countByField<K extends keyof AnimeEntry['data']>(
  animeList: AnimeEntry[],
  field: K
): Map<string, number> {
  const map = new Map<string, number>();
  for (const anime of animeList) {
    const value = anime.data[field];
    if (value == null) continue;
    const key = String(value);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}