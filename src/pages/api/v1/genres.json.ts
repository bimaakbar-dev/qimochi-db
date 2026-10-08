// src/pages/api/v1/genres.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';
import { countByArrayField } from '~/lib/data';

export const GET: APIRoute = async () => {
  const [genres, allAnime] = await Promise.all([
    getCollection('genres'),
    getCollection('anime', ({ data }) => !data.draft),
  ]);

  const countMap = countByArrayField(allAnime, 'genres');

  const data = genres
    .map((g) => ({
      id: g.data.id,
      name: g.data.name,
      category: g.data.category,
      description: g.data.description ?? null,
      count: countMap.get(g.data.id) ?? 0,
    }))
    .sort((a, b) => {
      const order = { genre: 0, theme: 1, demographic: 2 } as const;
      const diff = order[a.category] - order[b.category];
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();