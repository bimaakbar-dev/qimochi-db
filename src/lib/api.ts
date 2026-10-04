import { getCollection } from 'astro:content';
import type { AnimeEntry } from './anime';

/**
 * Bentuk data API publik. Ubah di sini = ubah kontrak API.
 * Penamaan field di API memakai snake_case.
 */

const isoDate = (d?: Date) => (d ? d.toISOString().slice(0, 10) : null);

export async function getLookups() {
  const [genres, studios, franchises] = await Promise.all([
    getCollection('genres'),
    getCollection('studios'),
    getCollection('franchises'),
  ]);
  const toMap = (items: { id: string; data: { name: string } }[]) =>
    new Map(items.map((i) => [i.id, i.data.name]));

  return {
    genres: toMap(genres),
    studios: toMap(studios),
    franchises: toMap(franchises),
  };
}
export type Lookups = Awaited<ReturnType<typeof getLookups>>;

const named = (ids: string[], names: Map<string, string>) =>
  ids.map((id) => ({ id, name: names.get(id) ?? id }));

/** Ringkas: dipakai di daftar. Genre dan studio hanya berupa ID. */
export function toSummary(e: AnimeEntry) {
  const d = e.data;
  return {
    id: e.id,
    title: d.title,
    title_en: d.titleEn ?? null,
    title_jp: d.titleJp ?? null,
    cover: d.cover,
    type: d.type,
    status: d.status,
    year: d.releaseDate.getUTCFullYear(),
    season: d.season ?? null,
    episode_count: d.episodeCount ?? null,
    rating: d.rating ?? null,
    genres: d.genres.map((g) => g.id),
    studios: d.studios.map((s) => s.id),
  };
}

/** Lengkap: dipakai di /anime/{id}.json. Genre dan studio sudah berisi nama. */
export function toDetail(e: AnimeEntry, l: Lookups) {
  const d = e.data;
  return {
    ...toSummary(e),
    genres: named(d.genres.map((g) => g.id), l.genres),
    studios: named(d.studios.map((s) => s.id), l.studios),
    synonyms: d.synonyms,
    tags: d.tags,
    trailer: d.trailer ?? null,
    adapted_from: d.adaptedFrom ?? null,
    age_rating: d.ageRating ?? null,
    release_date: isoDate(d.releaseDate),
    end_date: isoDate(d.endDate),
    episode_duration: d.episodeDuration ?? null,
    franchise: d.franchise
      ? { id: d.franchise.id, name: l.franchises.get(d.franchise.id) ?? d.franchise.id }
      : null,
    relations: d.relations.map((r) => ({ id: r.anime.id, type: r.type })),
    episodes: d.episodes.map((ep) => ({
      number: ep.number,
      title: ep.title ?? null,
      air_date: isoDate(ep.airDate),
      duration: ep.duration ?? null,
    })),
    external_ids: {
      mal: d.malId ?? null,
      anilist: d.anilistId ?? null,
      kitsu: d.kitsuId ?? null,
    },
    synopsis: e.body?.trim() || null,
    added_at: isoDate(d.addedAt),
    updated_at: isoDate(d.updatedAt),
  };
}

export function toStats(all: AnimeEntry[]) {
  const count = (keys: string[]) =>
    keys.reduce<Record<string, number>>((acc, k) => {
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});

  return {
    total: all.length,
    by_status: count(all.map((e) => e.data.status)),
    by_type: count(all.map((e) => e.data.type)),
    total_episodes: all.reduce((sum, e) => sum + (e.data.episodeCount ?? 0), 0),
  };
}
