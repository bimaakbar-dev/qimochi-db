import { getCollection } from 'astro:content';
import { PER_PAGE } from '../constants';
import { sortByRecent, type AnimeEntry } from './anime';

export type { AnimeEntry };

export const STATUS_MAP = {
  ongoing: 'Ongoing',
  complete: 'Completed',
  hiatus: 'Hiatus',
} as const;

export type StatusSlug = keyof typeof STATUS_MAP;

export async function getAnimeByStatus(status: string): Promise<AnimeEntry[]> {
  const allAnime = await getCollection('anime');
  const filtered = allAnime.filter(a => a.data.status === status);
  return sortByRecent(filtered);
}

export async function getStatusData(slug: StatusSlug) {
  const status = STATUS_MAP[slug];
  const anime = await getAnimeByStatus(status);
  const totalPages = Math.ceil(anime.length / PER_PAGE);
  return { status, anime, totalPages };
}

export function buildStatusPaths(
  slug: StatusSlug,
  anime: AnimeEntry[],
  totalPages: number
) {
  const paths = [
    {
      params: { page: undefined },
      props: { anime, totalPages, pageNumber: 1 },
    },
  ];

  for (let page = 2; page <= totalPages; page++) {
    paths.push({
      params: { page: String(page) },
      props: { anime, totalPages, pageNumber: page },
    });
  }

  return paths;
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PER_PAGE;
  return items.slice(start, start + PER_PAGE);
}