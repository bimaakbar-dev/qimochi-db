import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getAllAnime, getAnimeById } from '~/lib/anime';
import { jsonResponse, errorResponse, corsPreflightResponse } from '~/lib/api/response';

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

  const d = anime.data;

  type StudioEntry = CollectionEntry<'studios'>;

  const allStudios = await getCollection('studios');
  const studioMap = new Map(
    allStudios.map((s: StudioEntry) => [s.data.id, s.data.name])
  );

  const studios = d.studios.map((slug: string) => ({
    slug,
    name: studioMap.get(slug) ?? slug,
  }));

  const data = {
    id: anime.id,

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

    stats: d.stats ?? null,

    genres: d.genres,
    studios,
    franchises: d.franchises,

    image: d.image ?? null,
    banner: d.banner ?? null,
    trailer: d.trailer ?? null,

    episodeList: d.episodeList,
    characters: d.characters,
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();