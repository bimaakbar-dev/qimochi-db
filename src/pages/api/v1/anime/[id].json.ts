import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { AnimeEntry } from '~/lib/anime';
import { getLookups, toDetail } from '~/lib/api';

export async function getStaticPaths() {
  const all = await getCollection('anime');
  return all.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

export const GET: APIRoute<{ entry: AnimeEntry }> = async ({ props }) => {
  return Response.json({ data: toDetail(props.entry, await getLookups()) });
};