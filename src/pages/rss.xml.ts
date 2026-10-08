// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllAnime } from '~/lib/anime';
import { SITE } from '~/constants';

export async function GET(context: APIContext) {
  const allAnime = await getAllAnime();

  const items = allAnime
    .filter((a) => a.data.aired?.from)
    .sort((a, b) => {
      const dateA = a.data.aired!.from.getTime();
      const dateB = b.data.aired!.from.getTime();
      return dateB - dateA;
    })
    .slice(0, 20)
    .map((anime) => {
      const d = anime.data;
      const link = `/anime/${anime.id}/`;
      const pubDate = d.aired!.from;

      const summary = [
        d.year ? String(d.year) : null,
        d.type,
        d.status,
      ]
        .filter(Boolean)
        .join(' · ');

      return {
        title: d.title,
        link,
        pubDate,
        description: summary,
        categories: d.genres,
      };
    });

  return rss({
    title: `${SITE.name} — Anime Terbaru`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>id-ID</language>`,
  });
}