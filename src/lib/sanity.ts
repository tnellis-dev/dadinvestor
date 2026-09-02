import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.ig18nrb8,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-03-01',
  useCdn: true, // Use Cloudflare/Edge caching for blazing-fast reads
});