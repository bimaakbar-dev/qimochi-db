// src/pages/api/v1/anime.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { corsPreflightResponse, jsonResponse } from '~/lib/api/response';

export const GET: APIRoute = async () => {
  const allAnime = await getCollection('anime', ({ data }) => !data.draft);

  const data = allAnime.map((anime) => {
    const d = anime.data;
    return {
      id: anime.id,
      slug: anime.id,
      url: `/anime/${anime.id}/`,

      title: d.title,
      titleEnglish: d.titleEnglish ?? null,
      titleNative: d.titleNative ?? null,

      type: d.type,
      status: d.status,
      source: d.source ?? null,
      season: d.season ?? null,
      year: d.year ?? null,
      episodes: d.episodes ?? null,
      duration: d.duration ?? null,
      rating: d.rating ?? null,

      aired: d.aired ?? null,

      genres: d.genres,
      studios: d.studios,
      producers: d.producers,

      stats: d.stats ?? null,

      image: d.image ?? null,
      banner: d.banner ?? null,
      trailer: d.trailer ?? null,
    };
  });

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();