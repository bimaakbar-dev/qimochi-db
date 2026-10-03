import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const anime = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/anime' }),
  schema: z.object({
    title: z.string(),
    cover: z.url(),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus']),
    type: z.enum(['TV', 'Movie', 'OVA', 'ONA', 'Special']),
    genre: z.array(z.string()).min(1),
    studio: z.string(),
    releaseDate: z.coerce.date(),
    addedAt: z.coerce.date(),
    rating: z.number().min(0).max(10),
    episodes: z.array(
      z.object({
        number: z.number().int().positive(),
        title: z.string().optional(),
        streams: z.array(
          z.object({
            quality: z.string(),
            servers: z.array(
              z.object({
                name: z.string(),
                url: z.url(),
              })
            ),
          })
        ),
        downloads: z
          .array(
            z.object({
              quality: z.string(),
              size: z.string(),
              servers: z.array(
                z.object({
                  name: z.string(),
                  url: z.url(),
                })
              ),
            })
          )
          .optional(),
      })
    ),

    batch: z
      .array(
        z.object({
          quality: z.string(),
          size: z.string(),
          servers: z.array(
            z.object({
              name: z.string(),
              url: z.url(),
            })
          ),
        })
      )
      .optional(),
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