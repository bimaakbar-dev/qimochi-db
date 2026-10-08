// src/pages/api/v1/meta.json.ts
import type { APIRoute } from 'astro';
import { jsonResponse, corsPreflightResponse, API_VERSION } from '~/lib/api/response';
import { SITE } from '~/constants';

export const GET: APIRoute = () => {
  const data = {
    name: 'Yukionime API',
    version: API_VERSION,
    site: SITE.url,
    locale: SITE.locale,
    description: SITE.description,

    license: {
      data: 'CC BY 4.0',
      dataUrl: 'https://creativecommons.org/licenses/by/4.0/',
      code: 'MIT',
      attribution: `Data dari Yukionime (${SITE.url})`,
    },

    policy: {
      auth: 'none',
      rateLimit: 'none',
      cors: 'enabled',
      cache: 'public, max-age=300, s-maxage=3600',
      sla: 'best-effort',
    },

    sources: [
      { name: 'MyAnimeList', url: 'https://myanimelist.net' },
      { name: 'AniList',     url: 'https://anilist.co' },
      { name: 'Kitsu',       url: 'https://kitsu.app' },
      { name: 'Wikipedia',   url: 'https://wikipedia.org' },
    ],

    changelog: [
      {
        version: 'v1',
        date: '2026-10-08',
        changes: [
          'Initial release',
          'Endpoint: /anime.json, /anime/[id].json, /anime-full.json',
          'Endpoint: /genres.json, /studios.json, /franchises.json',
          'Endpoint: /stats.json, /meta.json',
          'Standardized response: data + meta (version, total, generatedAt)',
        ],
      },
    ],
  };

  return jsonResponse(data);
};

export const OPTIONS: APIRoute = () => corsPreflightResponse();