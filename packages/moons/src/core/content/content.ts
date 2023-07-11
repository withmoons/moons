import { getCollection } from 'astro:content';

import { getHeadersFromEntry, getOpenGraphFromEntry } from '../metadata';
import type { CollectionName, ContentEntry, HydratedContent } from '../types';
import { getPathFromEntry, getUrlFromEntry } from './urls';

const _hydrateEntry = async (collection: CollectionName, entry: ContentEntry): Promise<HydratedContent> => {
  const path = await getPathFromEntry(entry);
  const hydratedContent: Omit<HydratedContent, 'metadata'> = {
    ...entry,
    collection,
    slug: path,
    path,
    data: {
      ...entry.data,
      url: await getUrlFromEntry({ ...entry, path }),
      identifier: entry.data.identifier || entry.slug,
      datePublished: entry.data.datePublished || entry.data.dateCreated,
      dateModified: entry.data.dateModified || entry.data.dateCreated,
    }
  };

  return {
    ...hydratedContent,
    metadata: {
      headers: getHeadersFromEntry(hydratedContent),
      openGraph: getOpenGraphFromEntry(hydratedContent),
    },
  }
};

const getEntryWithoutParent = async (): Promise<HydratedContent[]> => {
  const entries = await getContentEntries();
  return entries.filter(entry => !entry.data.isPartOf);
}

const getContentEntriesPartOf = async (slug: string): Promise<HydratedContent[]> => {
  const entries = await getContentEntries();
  return entries.filter(entry => entry.data.isPartOf === slug);
}

const getContentEntriesByCollection = async (collection: CollectionName): Promise<HydratedContent[]> => Promise.all(
  (await getCollection(collection)).map(e => _hydrateEntry(collection, e))
)

const getContentEntries = async (): Promise<HydratedContent[]> => {
  const [articleEntries, pageEntries] = await Promise.all([
    getContentEntriesByCollection('articles'),
    getContentEntriesByCollection('pages'),
  ]);

  return articleEntries.concat(pageEntries);
}

const getListingEntriesFromContentEntries = async (contentEntries: HydratedContent[]): Promise<HydratedContent[]> => {
  return contentEntries
    .filter(entry => contentEntries.findIndex(_entry => _entry.path === entry.data.isPartOf) !== -1)
    .reduce<HydratedContent[]>(async (acc, entry) => {
      const path = entry.data.isPartOf;
      if (!path || acc.findIndex(_entry => _entry.path === path) !== -1) {
        return acc;
      }

      const generatedEntry = await _hydrateEntry('pages', {
        id: path,
        slug: path,
        path,
        body: '',
        data: {
          layout: '@layouts/PageLayout.astro',
          url: '',
          name: path,
          description: path,
          identifier: path,
          dateCreated: entry.data.dateCreated,
          inLanguage: entry.data.inLanguage,
        }
      });

      return acc.concat(generatedEntry);
    }, []);
}

export const getContentPages = () => getContentEntries();
export const getPages = async () => {
  const contentPages = await getContentEntries();
  const listingPages = await getListingEntriesFromContentEntries(contentPages);

  return contentPages.concat(listingPages);
};
export const getRootPages = async () => await getEntryWithoutParent();
export const getContentPagesPartOf = async (slug: string) => await getContentEntriesPartOf(slug);
