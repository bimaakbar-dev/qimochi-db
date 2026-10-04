// src/pages/api/v1/franchises.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';

export const GET: APIRoute = async () => {
  const [franchises, allAnime] = await Promise.all([
    getCollection('franchises'),
    getCollection('anime', ({ data }) => !data.draft),
  ]);

  const animeByFranchise = new Map<string, string[]>();
  for (const anime of allAnime) {
    for (const franchiseSlug of anime.data.franchises) {
      const list = animeByFranchise.get(franchiseSlug) ?? [];
      list.push(anime.id);
      animeByFranchise.set(franchiseSlug, list);
    }
  }

  const data = franchises
    .map((f) => ({
      id: f.data.id,
      name: f.data.name,
      description: f.data.description ?? null,
      rootSlug: f.data.rootSlug ?? null,
      anime: animeByFranchise.get(f.data.id) ?? [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();