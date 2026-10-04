import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toStats } from '~/lib/api';

export const GET: APIRoute = async () => {
  return Response.json({ data: toStats(await getCollection('anime')) });
};
