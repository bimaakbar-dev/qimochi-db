export const SITE = {
  name: 'QimochiDB',
  title: 'QimochiDB',
  description: 'Database anime Indonesia — katalog lengkap, API gratis untuk developer.',
  url: 'https://qimochi.pages.dev',
  locale: 'id-ID',
  lang: 'id',
} as const;

export const NAV_LINKS = [
  { label: 'API',       href: '/docs/' },
] as const;

export const STATUSES = [
  'airing', 'finished', 'upcoming', 'hiatus', 'cancelled',
] as const;
export type Status = typeof STATUSES[number];

export const STATUS_LABEL: Record<Status, string> = {
  airing:    'Ongoing',
  finished:  'Completed',
  upcoming:  'Upcoming',
  hiatus:    'Hiatus',
  cancelled: 'Cancelled',
};

export const STATUS_VARIANT: Record<
  Status,
  'success' | 'default' | 'warning' | 'gold' | 'danger'
> = {
  airing:    'success',
  finished:  'default',
  upcoming:  'gold',
  hiatus:    'warning',
  cancelled: 'danger',
};

export const ANIME_TYPES = [
  'TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music', 'Unknown',
] as const;
export type AnimeType = typeof ANIME_TYPES[number];

export const SEASONS = ['winter', 'spring', 'summer', 'fall'] as const;
export type Season = typeof SEASONS[number];

export const SEASON_LABEL: Record<Season, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall:   'Fall',
};

export const SOURCES = [
  'original', 'manga', 'light_novel', 'visual_novel', 'game',
  'web_manga', 'web_novel', 'novel', 'book', 'picture_book',
  'radio', 'music', '4_koma_manga', 'card_game', 'other',
] as const;
export type Source = typeof SOURCES[number];

export const SOURCE_LABEL: Record<Source, string> = {
  original:      'Original',
  manga:         'Manga',
  light_novel:   'Light Novel',
  visual_novel:  'Visual Novel',
  game:          'Game',
  web_manga:     'Web Manga',
  web_novel:     'Web Novel',
  novel:         'Novel',
  book:          'Book',
  picture_book:  'Picture Book',
  radio:         'Radio',
  music:         'Music',
  '4_koma_manga':'4-Koma Manga',
  card_game:     'Card Game',
  other:         'Other',
};

export const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'R+', 'Rx'] as const;
export type AgeRating = typeof AGE_RATINGS[number];

export const AGE_RATING_LABEL: Record<AgeRating, string> = {
  G:        'G - Semua Umur',
  PG:       'PG - Anak-anak',
  'PG-13':  'PG-13 - Remaja 13+',
  R:        'R - 17+ (kekerasan & bahasa kasar)',
  'R+':     'R+ - Nudity ringan',
  Rx:       'Rx - Hentai',
};

export const RELATION_TYPES = [
  'sequel', 'prequel', 'side_story', 'parent_story', 'alternative',
  'spin_off', 'adaptation', 'character', 'summary', 'full_story',
  'compilation', 'contains', 'other',
] as const;
export type RelationType = typeof RELATION_TYPES[number];

export const RELATION_LABEL: Record<RelationType, string> = {
  sequel:      'Sekuel',
  prequel:     'Prekuel',
  side_story:  'Cerita Sampingan',
  parent_story:'Cerita Induk',
  alternative: 'Versi Alternatif',
  spin_off:    'Spin-off',
  adaptation:  'Adaptasi',
  character:   'Karakter',
  summary:     'Ringkasan',
  full_story:  'Cerita Lengkap',
  compilation: 'Kompilasi',
  contains:    'Berisi',
  other:       'Terkait',
};

export const MONTHS_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
] as const;

export const PER_PAGE = 2;

export const BREAKPOINTS = {
  mobile:  '50rem',
  desktop: '72rem',
} as const;

export const URLS = {
  anime: (slug: string) => `/anime/${slug}/`,
  search: (query?: string) =>
    query ? `/search/anime/?q=${encodeURIComponent(query)}` : '/search/anime/',
  api: (slug: string) => `/api/v1/anime/${slug}.json`,
} as const;