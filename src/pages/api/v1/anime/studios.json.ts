import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const [studios, anime] = await Promise.all([
    getCollection('studios'),
    getCollection('anime'),
  ]);

  const data = studios
    .map((s) => ({
      id: s.id,
      name: s.data.name,
      website: s.data.website ?? null,
      count: anime.filter((a) => a.data.studios.some((r) => r.id === s.id)).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'id-ID'));

  return Response.json({ data, meta: { total: data.length } });
};
