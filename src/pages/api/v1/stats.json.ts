// src/pages/api/v1/stats.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';
import { countByArrayField, countByField } from '~/lib/data';

export const GET: APIRoute = async () => {
  const [allAnime, genres, studios] = await Promise.all([
    getCollection('anime', ({ data }) => !data.draft),
    getCollection('genres'),
    getCollection('studios'),
  ]);

  const toObject = (map: Map<string | number, number>) =>
    Object.fromEntries(
      [...map.entries()].sort((a, b) => b[1] - a[1])
    );

  const data = {
    total: {
      anime: allAnime.length,
      genres: genres.length,
      studios: studios.length,
    },
    byStatus: toObject(countByField(allAnime, 'status')),
    byType: toObject(countByField(allAnime, 'type')),
    bySeason: toObject(countByField(allAnime, 'season')),
    byYear: toObject(countByField(allAnime, 'year')),
    bySource: toObject(countByField(allAnime, 'source')),
    byRating: toObject(countByField(allAnime, 'rating')),
    topGenres: toObject(countByArrayField(allAnime, 'genres')),
    topStudios: toObject(countByArrayField(allAnime, 'studios')),
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();