import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    sanity({
      projectId: 'ig18nrb8',
      dataset: 'production',
      useCdn: true,
      studioBasePath: '/admin', // This hosts your studio button/interface at /admin
    }),
  ],
});