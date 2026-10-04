import type { APIRoute } from 'astro';
import { getGenres } from '~/lib/genre';

export const GET: APIRoute = async () => {
  const genres = await getGenres();
  return Response.json({
    data: genres.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description ?? null,
      count: g.count,
    })),
    meta: { total: genres.length },
  });
};
