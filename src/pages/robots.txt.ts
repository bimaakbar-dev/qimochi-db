import type { APIRoute } from 'astro';
import { SITE } from '~/constants';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /

Disallow: /search/
Disallow: /api/
Disallow: /404

Sitemap: ${SITE.url}/sitemap-index.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};