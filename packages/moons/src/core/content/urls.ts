import { getConfig } from '@withmoons/config';
import { join } from 'path';

import { getContentPageBySlug } from './repository';
import type { ContentEntry, } from '../types';

const _getPathFromEntry = (entry: ContentEntry): string =>
  (entry.data.identifier === 'index' ? '' : entry.data.identifier) || entry.slug;

export const getPathFromEntry = async (entry: ContentEntry): Promise<string> => {
  // TODO: take language into account
  // if (entry.data.inLanguage) {
  // }

  const path = _getPathFromEntry(entry);
  if (!entry.data.isPartOf) {
    return path;
  }

  const parent = await getContentPageBySlug(entry.data.isPartOf)
  const base = parent ? (await getPathFromEntry(parent)) : `${entry.data.isPartOf}/`;
  return join(base, path);
}

export const getUrlFromEntry = async (entry: ContentEntry): Promise<string> => {
  if (entry.data.url) {
    return entry.data.url;
  }

  const { webManifest: { start_url: url } } = getConfig();

  return new URL(entry.path, url).toString()
}
