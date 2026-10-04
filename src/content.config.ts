// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Harus lowercase-kebab-case');

const ISODate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD');

const ExternalUrl = z.url();

const AnimeType = z.enum([
  'TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music', 'Unknown',
]);

const AnimeStatus = z.enum([
  'airing', 'finished', 'upcoming', 'hiatus', 'cancelled',
]);

const AnimeSource = z.enum([
  'original', 'manga', 'light_novel', 'visual_novel', 'game',
  'web_manga', 'web_novel', 'novel', 'book', 'picture_book',
  'radio', 'music', '4_koma_manga', 'card_game', 'other',
]);

const AnimeSeason = z.enum(['winter', 'spring', 'summer', 'fall']);
const AnimeRating = z.enum(['G', 'PG', 'PG-13', 'R', 'R+', 'Rx']);

const RelationType = z.enum([
  'sequel', 'prequel', 'side_story', 'parent_story', 'alternative',
  'spin_off', 'adaptation', 'character', 'summary', 'full_story',
  'compilation', 'contains', 'other',
]);

const anime = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!**/_*.md'],
    base: './src/content/anime',
    deferRender: true,
  }),
  schema: z.object({
    title: z.string().min(1),
    titleEnglish: z.string().optional(),
    titleNative: z.string().optional(),

    malId: z.number().int().positive().optional(),
    anilistId: z.number().int().positive().optional(),
    kitsuId: z.string().optional(),

    type: AnimeType,
    status: AnimeStatus,
    source: AnimeSource.optional(),
    season: AnimeSeason.optional(),
    year: z.number().int().min(1900).max(2100).optional(),
    episodes: z.number().int().positive().nullable().optional(),
    duration: z.number().int().positive().optional(),
    rating: AnimeRating.optional(),

    aired: z.object({
      from: ISODate,
      to: ISODate.nullable().optional(),
    }).optional(),

    stats: z.object({
      score: z.number().min(0).max(10).optional(),
      scoredBy: z.number().int().nonnegative().optional(),
    }).optional(),

    genres: z.array(Slug).default([]),
    studios: z.array(Slug).default([]),
    franchises: z.array(z.object({
      relation: RelationType,
      slug: Slug,
      title: z.string().optional(),
    })).default([]),

    image: ExternalUrl.optional(),
    banner: ExternalUrl.optional(),
    trailer: z.string().optional(),

    episodeList: z.array(z.object({
      number: z.number().int().positive(),
      title: z.string(),
      aired: ISODate.optional(),
      duration: z.number().int().positive().optional(),
    })).default([]),

    characters: z.array(z.object({
      name: z.string(),
      nameNative: z.string().optional(),
      image: ExternalUrl.optional(),
      role: z.enum(['main', 'supporting', 'background']).default('supporting'),
      voiceActors: z.array(z.object({
        name: z.string(),
        image: ExternalUrl.optional(),
        language: z.string().optional(),
      })).default([]),
    })).default([]),

    draft: z.boolean().default(false),
  }),
});

const genres = defineCollection({
  loader: file('./src/data/genres.json'),
  schema: z.object({
    id: Slug,
    name: z.string(),
    description: z.string().optional(),
    category: z.enum(['genre', 'theme', 'demographic']).default('genre'),
  }),
});

const studios = defineCollection({
  loader: file('./src/data/studios.json'),
  schema: z.object({
    id: Slug,
    name: z.string(),
    nameNative: z.string().optional(),
    founded: z.number().int().min(1900).max(2100).optional(),
    website: ExternalUrl.optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  anime,
  genres,
  studios,
};