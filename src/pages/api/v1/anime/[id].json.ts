// src/pages/api/v1/anime/[id].json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, errorResponse, corsPreflightResponse } from '~/lib/api/response';

export async function getStaticPaths() {
  const allAnime = await getCollection('anime', ({ data }) => !data.draft);
  return allAnime.map((anime) => ({
    params: { id: anime.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return errorResponse('BAD_REQUEST', 'Missing anime id', 400);

  const allAnime = await getCollection('anime', ({ data }) => !data.draft);
  const anime = allAnime.find((a) => a.id === id);

  if (!anime) {
    return errorResponse('NOT_FOUND', `Anime '${id}' not found`, 404);
  }

  const d = anime.data;

  // Resolve studio slug → name
  const allStudios = await getCollection('studios');
  const studioMap = new Map(allStudios.map((s) => [s.data.id, s.data.name]));
  const studios = d.studios.map((slug) => ({
    slug,
    name: studioMap.get(slug) ?? slug,
  }));

  const data = {
    id: anime.id,
    slug: anime.id,
    url: `/anime/${anime.id}/`,

    title: d.title,
    titleEnglish: d.titleEnglish ?? null,
    titleNative: d.titleNative ?? null,

    externalIds: {
      mal: d.malId ?? null,
      anilist: d.anilistId ?? null,
      kitsu: d.kitsuId ?? null,
    },

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
    studios,
    producers: d.producers,
    franchises: d.franchises,
    related: d.related,

    stats: d.stats ?? null,

    image: d.image ?? null,
    banner: d.banner ?? null,
    trailer: d.trailer ?? null,

    streaming: d.streaming,
    tags: d.tags,

    nsfw: d.nsfw,
    contributors: d.contributors,
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();