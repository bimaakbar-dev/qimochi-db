// src/lib/search.ts
import type { CollectionEntry } from 'astro:content';
import { PER_PAGE } from '~/constants';

export type AnimeEntry = CollectionEntry<'anime'>;

export type SortOption =
  | 'trending'
  | 'rating'
  | 'popular'
  | 'recent'
  | 'title';

export interface SearchParams {
  q: string;
  status: string;
  type: string;
  genre: string;
  season: string;
  year: string;
  sort: SortOption;
  page: number;
}

// ------------------------------------------------------------
// PARSE URL → SearchParams
// ------------------------------------------------------------
export function parseSearchParams(url: URL): SearchParams {
  const sp = url.searchParams;

  const sortRaw = sp.get('sort') ?? 'trending';
  const sort = (
    ['trending', 'rating', 'popular', 'recent', 'title'].includes(sortRaw)
      ? sortRaw
      : 'trending'
  ) as SortOption;

  return {
    q: (sp.get('q') ?? '').trim(),
    status: sp.get('status') ?? '',
    type: sp.get('type') ?? '',
    genre: sp.get('genre') ?? '',
    season: sp.get('season') ?? '',
    year: sp.get('year') ?? '',
    sort,
    page: Math.max(1, Number(sp.get('page') ?? 1)),
  };
}

// ------------------------------------------------------------
// FILTER
// ------------------------------------------------------------
export function filterAnime(
  list: AnimeEntry[],
  params: SearchParams
): AnimeEntry[] {
  const q = params.q.toLowerCase();

  return list.filter((anime) => {
    const d = anime.data;

    if (params.status && d.status !== params.status) return false;
    if (params.type && d.type !== params.type) return false;
    if (params.season && d.season !== params.season) return false;
    if (params.year && d.year !== Number(params.year)) return false;
    if (params.genre && !d.genres.includes(params.genre)) return false;

    if (q) {
      const haystack = [
        d.title,
        d.titleEnglish ?? '',
        d.titleNative ?? '',
        ...(d.synonyms ?? []),
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

// ------------------------------------------------------------
// SORT
// ------------------------------------------------------------
export function sortAnime(
  list: AnimeEntry[],
  sort: SortOption
): AnimeEntry[] {
  const copy = [...list];

  switch (sort) {
    case 'rating':
      return copy.sort(
        (a, b) => (b.data.stats?.score ?? 0) - (a.data.stats?.score ?? 0)
      );

    case 'popular':
      return copy.sort(
        (a, b) =>
          (b.data.stats?.members ?? 0) - (a.data.stats?.members ?? 0)
      );

    case 'recent':
      return copy.sort((a, b) => (b.data.year ?? 0) - (a.data.year ?? 0));

    case 'title':
      return copy.sort((a, b) =>
        a.data.title.localeCompare(b.data.title)
      );

    case 'trending':
    default:
      // trending = popularity kecil = populer
      return copy.sort(
        (a, b) =>
          (a.data.stats?.popularity ?? 999999) -
          (b.data.stats?.popularity ?? 999999)
      );
  }
}

// ------------------------------------------------------------
// PAGINATE
// ------------------------------------------------------------
export function paginateAnime(list: AnimeEntry[], page: number) {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * PER_PAGE;
  const items = list.slice(start, start + PER_PAGE);

  return { items, total, totalPages, currentPage: current };
}

// ------------------------------------------------------------
// BUILD URL — preserve query params
// ------------------------------------------------------------
export function buildSearchUrl(
  baseParams: Partial<SearchParams>,
  overrides: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();

  const merged: Record<string, unknown> = { ...baseParams, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'sort' && value === 'trending') continue;
    if (key === 'page' && value === 1) continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `/search/anime/?${qs}` : '/search/anime/';
}