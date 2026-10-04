export const SITE = {
  name: 'QimochiDB',
  title: 'QimochiDB',
  description: 'Database anime Indonesia — katalog lengkap, API gratis untuk developer.',
  url: 'https://qimochi.pages.dev',
  locale: 'id-ID',
  lang: 'id',
} as const;

export const NAV_LINKS = [
  { label: 'Beranda',   href: '/' },
  { label: 'Katalog',   href: '/anime/' },
  { label: 'Ongoing',   href: '/anime/ongoing/' },
  { label: 'Completed', href: '/anime/completed/' },
  { label: 'Genre',     href: '/genre/' },
  { label: 'API',       href: '/docs/' },
] as const;

/* Genre, studio, dan franchise tidak lagi didaftar di sini.
   Sumbernya: src/data/genres.json, studios.json, franchises.json */

export const STATUSES = ['Ongoing', 'Completed', 'Hiatus', 'Upcoming'] as const;
export type Status = typeof STATUSES[number];

export const STATUS_VARIANT: Record<Status, 'success' | 'default' | 'warning' | 'gold'> = {
  'Ongoing':   'success',
  'Completed': 'default',
  'Hiatus':    'warning',
  'Upcoming':  'gold',
};

export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'] as const;
export type AnimeType = typeof ANIME_TYPES[number];

export const SEASONS = ['winter', 'spring', 'summer', 'fall'] as const;
export type Season = typeof SEASONS[number];
export const SEASON_LABEL: Record<Season, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
};

export const ADAPTED_FROM = [
  'Manga', 'Light Novel', 'Web Novel', 'Visual Novel', 'Game', 'Original', 'Other',
] as const;

export const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R-17+', 'R+'] as const;

export const RELATION_TYPES = [
  'sequel', 'prequel', 'spin_off', 'side_story', 'summary', 'alternative', 'other',
] as const;
export type RelationType = typeof RELATION_TYPES[number];
export const RELATION_LABEL: Record<RelationType, string> = {
  sequel: 'Sekuel',
  prequel: 'Prekuel',
  spin_off: 'Spin-off',
  side_story: 'Cerita sampingan',
  summary: 'Ringkasan',
  alternative: 'Versi alternatif',
  other: 'Terkait',
};

export const PER_PAGE = 24;

export const BREAKPOINTS = {
  tablet:  '48rem',
  desktop: '56rem',
} as const;

export const URLS = {
  anime:  (slug: string) => `/anime/${slug}/`,
  genre:  (id: string) => `/genre/${id}/`,
  status: (status: string) => `/anime/${status.toLowerCase()}/`,
  api:    (slug: string) => `/api/v1/anime/${slug}.json`,
} as const;
