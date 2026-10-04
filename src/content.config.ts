import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  ADAPTED_FROM,
  AGE_RATINGS,
  ANIME_TYPES,
  RELATION_TYPES,
  SEASONS,
  STATUSES,
} from './constants';

/* ---------- Anime (inti katalog) ----------
   ID entri = nama file (atau field `slug`). Jadi ID di URL dan API.
   Jangan rename file yang sudah publik. */
const anime = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anime' }),
  schema: z.object({
    // Judul
    title: z.string().min(1),
    titleEn: z.string().optional(),
    titleJp: z.string().optional(),
    synonyms: z.array(z.string()).default([]),
    slug: z.string().optional(),

    // Media
    cover: z.url(),
    trailer: z.url().optional(),

    // Klasifikasi
    type: z.enum(ANIME_TYPES),
    status: z.enum(STATUSES), // status tayang
    adaptedFrom: z.enum(ADAPTED_FROM).optional(),
    ageRating: z.enum(AGE_RATINGS).optional(),
    genres: z.array(reference('genres')).min(1),
    studios: z.array(reference('studios')).min(1),
    tags: z.array(z.string()).default([]),

    // Tayang
    releaseDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    season: z.enum(SEASONS).optional(),
    episodeCount: z.number().int().positive().optional(),
    episodeDuration: z.number().int().positive().optional(), // menit per episode

    // Relasi
    franchise: reference('franchises').optional(),
    relations: z
      .array(z.object({ anime: reference('anime'), type: z.enum(RELATION_TYPES) }))
      .default([]),

    // Skor komunitas (bukan skor pribadi)
    rating: z.number().min(0).max(10).optional(),

    // Pengelolaan data
    addedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    // Detail episode (opsional, hanya metadata)
    episodes: z
      .array(
        z.object({
          number: z.number().int().positive(),
          title: z.string().optional(),
          airDate: z.coerce.date().optional(),
          thumbnail: z.url().optional(),
          duration: z.number().int().positive().optional(), // menit
        })
      )
      .default([]),

    // ID eksternal untuk pencocokan data
    malId: z.number().int().positive().optional(),
    anilistId: z.number().int().positive().optional(),
    kitsuId: z.string().optional(),

    source: z
      .enum(['Manual', 'MAL', 'AniList', 'Kitsu', 'Mixed'])
      .default('Manual'),
  }),
});

/* ---------- Data rujukan (satu file JSON per koleksi) ---------- */
const named = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const genres = defineCollection({
  loader: file('src/data/genres.json'),
  schema: named,
});

const studios = defineCollection({
  loader: file('src/data/studios.json'),
  schema: named.extend({ website: z.url().optional() }),
});

const franchises = defineCollection({
  loader: file('src/data/franchises.json'),
  schema: named,
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(200),
    cover: z.url().optional(),
    date: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Admin'),
    category: z.enum(['News', 'Review', 'List', 'Guide', 'Update']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { anime, genres, studios, franchises, blog };
