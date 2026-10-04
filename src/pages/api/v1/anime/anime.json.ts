// src/pages/api/v1/anime.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

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
      synonyms: d.synonyms ?? [],

      type: d.type,
      status: d.status,
      source: d.source ?? null,
      season: d.season ?? null,
      year: d.year ?? null,
      episodes: d.episodes ?? null,
      duration: d.duration ?? null,
      rating: d.rating ?? null,

      genres: d.genres,
      studios: d.studios,
      producers: d.producers,

      stats: d.stats ?? null,

      image: d.image ?? null,
      banner: d.banner ?? null,
    };
  });

  return new Response(JSON.stringify({ data, total: data.length }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
