import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yukionime.pages.dev',
  trailingSlash: 'always',
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Montserrat.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Inter.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "FiraCode",
      cssVariable: "--font-firaCode",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/FiraCode.woff2"],
          },
        ],
      },
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/search/')) return false;
        if (page.includes('/404/')) return false;
        if (page.includes('/dmca/')) return false;
        if (page.includes('/disclaimer/')) return false;
        if (/\/\d+\/$/.test(page)) return false;

        return true;
      },
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  experimental: {
    incrementalBuild: true,
    svgOptimizer: svgoOptimizer(),
  },
});
