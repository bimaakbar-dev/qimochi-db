import { getCollection } from 'astro:content';
import { GENRES, PER_PAGE } from '../constants';
import { sortByRecent, type AnimeEntry } from './anime';

export type { AnimeEntry };

export function genreToSlug(genre: string): string {
  return genre.toLowerCase().replace(/\s+/g, '-');
}

export async function getAnimeByGenre(genre: string): Promise<AnimeEntry[]> {
  const allAnime = await getCollection('anime');
  const filtered = allAnime.filter(a => a.data.genre.includes(genre));
  return sortByRecent(filtered);
}

export async function getGenreData(genre: string) {
  const anime = await getAnimeByGenre(genre);
  const totalPages = Math.ceil(anime.length / PER_PAGE);
  return { anime, totalPages, slug: genreToSlug(genre) };
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PER_PAGE;
  return items.slice(start, start + PER_PAGE);
}

export function allGenreSlugs() {
  return GENRES.map(g => ({
    genre: g,
    slug: genreToSlug(g),
  }));
}