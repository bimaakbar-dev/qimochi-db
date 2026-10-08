// src/pages/api/v1/anime-full.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllAnime } from '~/lib/anime';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';
import { buildAnimeDetail } from '~/lib/api/anime-detail';

export const GET: APIRoute = async () => {
  const [allAnime, allStudios] = await Promise.all([
    getAllAnime(),
    getCollection('studios'),
  ]);

  const studioMap = new Map(
    allStudios.map((s) => [s.data.id, s.data.name])
  );

  const data = allAnime
    .map((anime) => buildAnimeDetail(anime, studioMap))
    .sort((a, b) => a.title.localeCompare(b.title));

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();