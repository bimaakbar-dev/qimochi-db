// src/pages/api/v1/studios.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';
import { countByArrayField } from '~/lib/data';

export const GET: APIRoute = async () => {
  const [studios, allAnime] = await Promise.all([
    getCollection('studios'),
    getCollection('anime', ({ data }) => !data.draft),
  ]);

  const countMap = countByArrayField(allAnime, 'studios');

  const data = studios
    .map((s) => ({
      id: s.data.id,
      name: s.data.name,
      nameNative: s.data.nameNative ?? null,
      founded: s.data.founded ?? null,
      website: s.data.website ?? null,
      description: s.data.description ?? null,
      count: countMap.get(s.data.id) ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();