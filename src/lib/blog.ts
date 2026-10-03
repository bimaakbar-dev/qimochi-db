import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

/**
 * Ambil semua artikel blog yang published (bukan draft).
 * Sort by date descending (terbaru dulu).
 */
export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  return [...allPosts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

/**
 * Ambil artikel by slug — return null kalau draft atau tidak ada.
 */
export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogEntry | null> {
  const allPosts = await getCollection('blog');
  const post = allPosts.find(p => p.id === slug);
  if (!post || post.data.draft) return null;
  return post;
}

/**
 * Ambil semua slug artikel published — untuk getStaticPaths.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map(p => p.id);
}

/**
 * Format tanggal ke format Indonesia.
 * Contoh: "15 Februari 2026"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format tanggal singkat.
 * Contoh: "15 Feb 2026"
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Ambil artikel terkait berdasarkan tag yang sama.
 * Return max `limit` artikel, exclude artikel itu sendiri.
 */
export function getRelatedPosts(
  current: BlogEntry,
  all: BlogEntry[],
  limit = 3
): BlogEntry[] {
  const currentTags = new Set(current.data.tags);

  if (currentTags.size === 0) return [];

  return all
    .filter(post => post.id !== current.id)
    .map(post => ({
      post,
      score: post.data.tags.filter(t => currentTags.has(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

/**
 * Ambil semua tag unik dari artikel published + jumlah per tag.
 * Sort by count descending, lalu alfabetis.
 */
export function collectTags(
  posts: BlogEntry[]
): { tag: string; count: number }[] {
  const counts: Record<string, number> = {};

  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'id-ID'));
}

/**
 * Ambil artikel by tag.
 */
export function filterByTag(posts: BlogEntry[], tag: string): BlogEntry[] {
  return posts.filter(post => post.data.tags.includes(tag));
}

/**
 * Ambil artikel by category.
 */
export function filterByCategory(
  posts: BlogEntry[],
  category: string
): BlogEntry[] {
  return posts.filter(post => post.data.category === category);
}

/**
 * Build canonical URL untuk artikel blog.
 */
export function postUrl(slug: string): string {
  return `/blog/${slug}/`;
}