import type { HydratedContent, MetaDataHeaders } from '../types';

export const getHeadersFromEntry = (entry: Omit<HydratedContent, 'metadata'>): MetaDataHeaders => ({
  title: entry.data.name,
  description: entry.data.description,
  canonical: entry.data.url,
  alternates: [
    { href: entry.data.url, hreflang: 'x-default' },
  ],
  robots: 'index,follow'
});
