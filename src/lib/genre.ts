import { getCollection } from 'astro:content';
import { PER_PAGE } from '../constants';
import { sortByRecent, type AnimeEntry } from './anime';

export type { AnimeEntry };

/** Semua genre dari src/data/genres.json beserta jumlah anime-nya. */
export async function getGenres() {
  const [genres, anime] = await Promise.all([
    getCollection('genres'),
    getCollection('anime'),
  ]);

  return genres
    .map((g) => ({
      id: g.id,
      name: g.data.name,
      description: g.data.description,
      count: anime.filter((a) => a.data.genres.some((r) => r.id === g.id)).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'id-ID'));
}

export async function getAnimeByGenre(genreId: string): Promise<AnimeEntry[]> {
  const allAnime = await getCollection('anime');
  const filtered = allAnime.filter((a) =>
    a.data.genres.some((r) => r.id === genreId)
  );
  return sortByRecent(filtered);
}

export async function getGenreData(genreId: string) {
  const anime = await getAnimeByGenre(genreId);
  const totalPages = Math.max(1, Math.ceil(anime.length / PER_PAGE));
  return { anime, totalPages };
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PER_PAGE;
  return items.slice(start, start + PER_PAGE);
}
