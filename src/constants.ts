export const SITE = {
  name: 'QimochiDB',
  title: 'Qimochi',
  description: 'Koleksi database anime terlengkap, cepat, tanpa ribet.',
  url: 'https://qimochi-db.github.io',
  locale: 'id-ID',
  lang: 'id',
} as const;

export const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Ongoing',  href: '/anime/ongoing/' },
  { label: 'Completed', href: '/anime/completed/' },
  { label: 'Archive',  href: '/anime/' },
  { label: 'Genre',    href: '/genre/' },
  { label: 'Blog', href: '/blog/' },
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

export const PER_PAGE = 9;

export const BREAKPOINTS = {
  tablet:  '48rem',
  desktop: '56rem',
} as const;

export const STORAGE_KEYS = {
  preferredQuality: 'qimochi:preferred-quality',
  preferredServer:  'qimochi:preferred-server',
} as const;

export const URLS = {
  anime:  (slug: string) => `/anime/${slug}/`,
  watch:  (slug: string, episode: number) => `/watch/${slug}/${episode}/`,
  genre:  (slug: string) => `/genre/${slug.toLowerCase().replace(/\s+/g, '-')}/`,
  status: (status: string) => `/anime/${status.toLowerCase()}/`,
} as const;