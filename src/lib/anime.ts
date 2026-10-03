import type { CollectionEntry } from 'astro:content';

export type AnimeEntry = CollectionEntry<'anime'>;

/**
 * Sort anime berdasarkan addedAt descending (terbaru dulu).
 * addedAt diupdate manual tiap kali tambah episode / update konten.
 *
 * Return array baru — tidak mutasi input.
 */
export function sortByRecent(items: AnimeEntry[]): AnimeEntry[] {
  return [...items].sort(
    (a, b) => b.data.addedAt.getTime() - a.data.addedAt.getTime()
  );
}

/**
 * Extract tahun rilis dari releaseDate.
 */
export function getYear(anime: AnimeEntry): number {
  return anime.data.releaseDate.getFullYear();
}