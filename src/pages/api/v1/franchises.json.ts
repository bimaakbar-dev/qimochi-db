// src/pages/api/v1/franchises.json.ts
import type { APIRoute } from 'astro';
import { getAllAnime } from '~/lib/anime';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';

export const GET: APIRoute = async () => {
  const allAnime = await getAllAnime();
  const animeMap = new Map(allAnime.map((a) => [a.id, a]));

  const data = allAnime
    .filter((a) => (a.data.franchises ?? []).length > 0)
    .map((a) => ({
      id: a.id,
      title: a.data.title,
      image: a.data.image ?? null,
      year: a.data.year ?? null,
      franchises: (a.data.franchises ?? []).map((rel) => {
        const target = animeMap.get(rel.slug);
        return {
          relation: rel.relation,
          slug: rel.slug,
          title: target?.data.title ?? rel.title ?? null,
          exists: Boolean(target),
        };
      }),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();