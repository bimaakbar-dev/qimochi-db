import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const anime = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anime' }),
  schema: z.object({
    title: z.string().min(1),
    titleEn: z.string().optional(),
    titleJp: z.string().optional(),
    slug: z.string().optional(),
    cover: z.url(),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus']),
    type: z.enum(['TV', 'Movie', 'OVA', 'ONA', 'Special']),
    genre: z.array(z.string()).min(1),
    studio: z.string().min(1),
    releaseDate: z.coerce.date(),
    addedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    rating: z.number().min(0).max(10),

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

    malId: z.number().int().positive().optional(),
    anilistId: z.number().int().positive().optional(),
    kitsuId: z.string().optional(),

    source: z
      .enum(['Manual', 'MAL', 'AniList', 'Kitsu', 'Mixed'])
      .default('Manual'),
  }),
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

export const collections = { anime, blog };