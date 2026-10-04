import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';

export const GET: APIRoute = async () => {
  const allAnime = await getCollection('anime', ({ data }) => !data.draft);

  const data = allAnime.map((anime) => {
    const d = anime.data;
    return {
      id: anime.id,
      title: d.title,
      titleEnglish: d.titleEnglish ?? null,
      titleNative: d.titleNative ?? null,
      image: d.image ?? null,
      year: d.year ?? null,
      type: d.type,
      status: d.status,
      season: d.season ?? null,
      genres: d.genres,
      studios: d.studios,
      stats: d.stats ?? null,
    };
  });

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();