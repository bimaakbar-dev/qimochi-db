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

  const mapToObject = (map: Map<string | number, number>) =>
    Object.fromEntries(map.entries());

  const data = {
    total: {
      anime: allAnime.length,
      genres: genres.length,
      studios: studios.length,
    },
    byStatus: mapToObject(countByField(allAnime, 'status')),
    byType: mapToObject(countByField(allAnime, 'type')),
    bySeason: mapToObject(countByField(allAnime, 'season')),
    byYear: mapToObject(countByField(allAnime, 'year')),
    bySource: mapToObject(countByField(allAnime, 'source')),
    byRating: mapToObject(countByField(allAnime, 'rating')),
    topGenres: mapToObject(countByArrayField(allAnime, 'genres')),
    topStudios: mapToObject(countByArrayField(allAnime, 'studios')),
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();