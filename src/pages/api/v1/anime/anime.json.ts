import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sortByRecent } from '~/lib/anime';
import { toSummary } from '~/lib/api';

export const GET: APIRoute = async () => {
  const all = sortByRecent(await getCollection('anime'));
  return Response.json({
    data: all.map((e) => toSummary(e)),
    meta: { total: all.length },
  });
};
