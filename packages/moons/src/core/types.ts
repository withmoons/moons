import type { CollectionEntry } from "astro:content";
import type { ArticleFrontmatter, PageFrontmatter } from "../assets/content/_schemas";
type ContentConfig = typeof import("../assets/content/config");

type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;

declare module 'astro:content' {
  interface Render {
    '.generated': Promise<{
      Content(props: Record<string, any>): string;
      headings: string[];
    }>;
  }
}

export type MetaDataHeaders = {
  title: string;
  description: string;
  canonical: string;
  alternates: Array<{
    href: string;
    hreflang: string;
  }>;
  robots: string;
};

export type OpenGraph = {
  title: string;
  description: string;
  url: string;
};

export type GeneratedPageEntry = {
  id: string;
  slug: string;
  path: string;
  body: string;
  data: import('astro/zod').infer<
    ReturnTypeOrOriginal<Required<ContentConfig['collections']['pages']>['schema']>
  >
};

export type CollectionName = keyof ContentConfig['collections']
export type ContentEntry = CollectionEntry<'articles'> | CollectionEntry<'pages'> | GeneratedPageEntry;
export type ContentFrontmatter = ArticleFrontmatter | PageFrontmatter;
export type HydratedContentFrontmatter = ContentFrontmatter & Required<Pick<ContentFrontmatter, 'url'>>
export type HydratedContent = ContentEntry & {
  path: string;
  collection: CollectionName;
  data: HydratedContentFrontmatter;
  metadata: {
    headers: MetaDataHeaders;
    openGraph: OpenGraph;
  },
};
