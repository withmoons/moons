import type { HydratedContent, OpenGraph } from '../types';

export const getOpenGraphFromEntry = (entry: Omit<HydratedContent, 'metadata'>): OpenGraph => ({
  title: entry.data.name,
  description: entry.data.description,
  url: entry.data.url,
});
