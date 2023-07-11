import { getEntryBySlug } from 'astro:content';
import type { ContentEntry, } from '../types';

export const getContentPageBySlug = async (slug: string): Promise<ContentEntry | undefined> => {
  const [articleEntry, pageEntry] = await Promise.all([
    getEntryBySlug('articles', slug),
    getEntryBySlug('pages', slug),
  ]);

  return pageEntry || articleEntry;
};
