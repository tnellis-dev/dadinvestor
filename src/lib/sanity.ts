import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'ig18nrb8',
  dataset: 'production',
  apiVersion: '2026-03-01',
  useCdn: false, // Set to false for development
});