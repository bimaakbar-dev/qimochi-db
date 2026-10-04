// src/pages/api/v1/index.json.ts
import type { APIRoute } from 'astro';
import { jsonResponse, corsPreflightResponse } from '~/lib/api/response';
import { SITE } from '~/constants';

export const GET: APIRoute = async () => {
  const data = {
    name: 'QimochiDB API',
    version: 'v1',
    site: SITE.url,
    generatedAt: new Date().toISOString(),
    endpoints: [
      {
        path: '/api/v1/anime.json',
        method: 'GET',
        description: 'List semua anime',
        example: `${SITE.url}/api/v1/anime.json`,
      },
      {
        path: '/api/v1/anime/[id].json',
        method: 'GET',
        description: 'Detail 1 anime berdasarkan slug',
        example: `${SITE.url}/api/v1/anime/kimetsu-no-yaiba.json`,
      },
      {
        path: '/api/v1/genres.json',
        method: 'GET',
        description: 'List semua genre + count',
        example: `${SITE.url}/api/v1/genres.json`,
      },
      {
        path: '/api/v1/studios.json',
        method: 'GET',
        description: 'List semua studio + count',
        example: `${SITE.url}/api/v1/studios.json`,
      },
      {
        path: '/api/v1/franchises.json',
        method: 'GET',
        description: 'List semua franchise + anime terkait',
        example: `${SITE.url}/api/v1/franchises.json`,
      },
      {
        path: '/api/v1/stats.json',
        method: 'GET',
        description: 'Statistik aggregate database',
        example: `${SITE.url}/api/v1/stats.json`,
      },
    ],
    responseFormat: {
      success: { data: 'any', meta: { total: 'number', generatedAt: 'ISO 8601' } },
      error: {
        error: { code: 'string', message: 'string', status: 'number' },
      },
    },
    license: 'Data terbuka untuk developer. Atribusi ke QimochiDB diharapkan.',
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();