export const SITE = {
  name: 'QimochiDB',
  title: 'QimochiDB',
  description: 'Database anime Indonesia — katalog lengkap, API gratis untuk developer.',
  url: 'https://qimochi-db.github.io',
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

export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Isekai',
  'Mecha',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

export type Genre = typeof GENRES[number];

export const STATUSES = ['Ongoing', 'Completed', 'Hiatus'] as const;
export type Status = typeof STATUSES[number];

export const STATUS_VARIANT: Record<Status, 'success' | 'default' | 'warning'> = {
  'Ongoing':   'success',
  'Completed': 'default',
  'Hiatus':    'warning',
};

export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'] as const;
export type AnimeType = typeof ANIME_TYPES[number];

export const PER_PAGE = 24;

export const BREAKPOINTS = {
  tablet:  '48rem',
  desktop: '56rem',
} as const;

export const URLS = {
  anime:  (slug: string) => `/anime/${slug}/`,
  genre:  (slug: string) => `/genre/${slug.toLowerCase().replace(/\s+/g, '-')}/`,
  status: (status: string) => `/anime/${status.toLowerCase()}/`,
  api:    (slug: string) => `/api/anime/${slug}.json`,
} as const;