// src/pages/api/v1/anime.json.ts
import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();

  const data = allAnime
    .map((anime) => {
      const d = anime.data;
      return {
        id: anime.id,
        title: d.title,
        titleEnglish: d.titleEnglish ?? null,
        titleNative: d.titleNative ?? null,
        image: d.image ?? null,
        type: d.type,
        status: d.status,
        season: d.season ?? null,
        year: d.year ?? null,
        episodes: d.episodes ?? null,
        duration: d.duration ?? null,
        rating: d.rating ?? null,
        genres: d.genres,
        studios: d.studios,
        stats: d.stats ?? null,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();