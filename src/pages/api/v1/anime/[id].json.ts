// src/pages/api/v1/anime/[id].json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAllAnime, getAnimeById } from '~/lib/anime';
import { jsonResponse, errorResponse, corsPreflightResponse } from '~/lib/api/response';
import { buildAnimeDetail } from '~/lib/api/anime-detail';

export async function getStaticPaths() {
  const allAnime = await getAllAnime();
  return allAnime.map((anime) => ({
    params: { id: anime.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return errorResponse('BAD_REQUEST', 'Missing anime id', 400);

  const anime = await getAnimeById(id);
  if (!anime) {
    return errorResponse('NOT_FOUND', `Anime '${id}' not found`, 404);
  }

  const allStudios = await getCollection('studios');
  const studioMap = new Map(
    allStudios.map((s) => [s.data.id, s.data.name])
  );

  const data = buildAnimeDetail(anime, studioMap);

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();