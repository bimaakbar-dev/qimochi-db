import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '~/constants';
import { getPublishedPosts } from '~/lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      pubDate: post.data.date,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>id-ID</language>`,
  });
}