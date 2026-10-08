// src/pages/api/v1/index.ts
import type { APIRoute } from 'astro';
import { jsonResponse, corsPreflightResponse, API_VERSION } from '~/lib/api/response';
import { SITE } from '~/constants';

export const GET: APIRoute = () => {
  const base = `${SITE.url}/api/${API_VERSION}`;

  const data = {
    name: 'Yukionime API',
    version: API_VERSION,
    site: SITE.url,
    documentation: `${SITE.url}/docs/`,
    license: 'CC BY 4.0',
    endpoints: [
      {
        path: '/anime.json',
        method: 'GET',
        description: 'Index ringkas semua anime (untuk list & filter)',
        url: `${base}/anime.json`,
      },
      {
        path: '/anime/[id].json',
        method: 'GET',
        description: 'Detail lengkap 1 anime berdasarkan slug',
        url: `${base}/anime/kimetsu-no-yaiba.json`,
      },
      {
        path: '/anime-full.json',
        method: 'GET',
        description: 'Snapshot semua anime dengan detail lengkap (1 file)',
        url: `${base}/anime-full.json`,
      },
      {
        path: '/genres.json',
        method: 'GET',
        description: 'Semua genre + jumlah anime',
        url: `${base}/genres.json`,
      },
      {
        path: '/studios.json',
        method: 'GET',
        description: 'Semua studio + jumlah anime',
        url: `${base}/studios.json`,
      },
      {
        path: '/franchises.json',
        method: 'GET',
        description: 'Semua franchise + relasi antar anime',
        url: `${base}/franchises.json`,
      },
      {
        path: '/stats.json',
        method: 'GET',
        description: 'Statistik agregat database',
        url: `${base}/stats.json`,
      },
      {
        path: '/meta.json',
        method: 'GET',
        description: 'Metadata API (versi, changelog, license)',
        url: `${base}/meta.json`,
      },
    ],
    responseFormat: {
      success: {
        data: 'any',
        meta: {
          version: 'string',
          total: 'number',
          generatedAt: 'ISO 8601',
        },
      },
      error: {
        error: {
          code: 'string',
          message: 'string',
          status: 'number',
        },
      },
    },
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();