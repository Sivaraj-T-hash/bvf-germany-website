export const SITE_NAME = 'BVF Germany';
export const SITE_URL = 'https://bvf-student-support.web.app';
export const DEFAULT_OG_IMAGE_PATH = '/hero-og.png';
export const DEFAULT_LOGO_PATH = '/site-logo.png';
export const DEFAULT_OG_IMAGE_ALT = 'BVF Germany logo';
export const DEFAULT_TWITTER_HANDLE = '@bvfgermany';
export const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export type StructuredData = Record<string, unknown>;

export type SeoOptions = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  robots?: string;
  googlebot?: string;
  noindex?: boolean;
  structuredData?: StructuredData | StructuredData[];
};

export function resolveAbsoluteUrl(value?: string) {
  const fallback =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : SITE_URL;
  const candidate = value || fallback;
  const absoluteUrl = new URL(candidate, SITE_URL);
  absoluteUrl.hash = '';
  return absoluteUrl.toString();
}

export function resolveKeywords(keywords?: string[]) {
  if (!keywords || keywords.length === 0) {
    return '';
  }

  return Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))).join(', ');
}

export function resolveStructuredData(structuredData?: StructuredData | StructuredData[]) {
  if (!structuredData) {
    return [];
  }

  return Array.isArray(structuredData) ? structuredData : [structuredData];
}
