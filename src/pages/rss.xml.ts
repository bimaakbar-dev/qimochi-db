// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllAnime } from '~/lib/anime';
import { SITE } from '~/constants';

const PLACEHOLDER = '/images/rss-placeholder.jpg';
const MAX_ITEMS = 20;

function getMimeType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function resolveImage(
  banner: string | undefined,
  image: string | undefined,
  siteUrl: string
): string {
  if (banner) return banner;
  if (image) return image;
  return new URL(PLACEHOLDER, siteUrl).toString();
}

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString() ?? SITE.url;

  const allAnime = await getAllAnime();

  const items = allAnime
    .filter((a) => a.data.aired?.from)
    .sort((a, b) => {
      const dateA = a.data.aired!.from.getTime();
      const dateB = b.data.aired!.from.getTime();
      return dateB - dateA;
    })
    .slice(0, MAX_ITEMS)
    .map((anime) => {
      const d = anime.data;
      const link = `/anime/${anime.id}/`;
      const pubDate = d.aired!.from;

      const summary = [d.year ? String(d.year) : null, d.type, d.status]
        .filter(Boolean)
        .join(' · ');

      const imageUrl = resolveImage(d.banner, d.image, siteUrl);

      return {
        title: d.title,
        link,
        pubDate,
        description: summary,
        categories: d.genres,
        enclosure: {
          url: imageUrl,
          length: 0,
          type: getMimeType(imageUrl),
        },
      };
    });

  return rss({
    title: `${SITE.name} — Anime Terbaru`,
    description: SITE.description,
    site: siteUrl,
    items,
    customData: `<language>id-ID</language>`,
  });
}