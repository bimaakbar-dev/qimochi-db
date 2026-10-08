// src/lib/api/anime-detail.ts
import type { HydratedAnime } from '~/lib/anime';

export function buildAnimeDetail(
  anime: HydratedAnime,
  studioMap: Map<string, string>
) {
  const d = anime.data;

  const studios = d.studios.map((slug) => ({
    slug,
    name: studioMap.get(slug) ?? slug,
  }));

  return {
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
    franchises: d.franchises ?? [],

    image: d.image ?? null,
    banner: d.banner ?? null,
    trailer: d.trailer ?? null,

    episodeList: d.episodeList ?? [],
    characters: d.characters ?? [],
  };
}