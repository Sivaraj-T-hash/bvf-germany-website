export const SITE_NAME = 'BVF Germany';
export const SITE_URL = 'https://www.bvfgermany.com';
export const DEFAULT_OG_IMAGE_PATH = '/hero-og.png';
export const DEFAULT_LOGO_PATH = '/site-logo.png';
export const DEFAULT_OG_IMAGE_ALT = 'BVF Germany logo';
export const DEFAULT_TWITTER_HANDLE = '@bvfgermany';
export const DEFAULT_THEME_COLOR = '#132033';
export const DEFAULT_LOCALE = 'en_IN';
export const DEFAULT_LANGUAGE = 'en-IN';
export const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const LEGACY_SITE_ORIGINS = new Set([
  'https://bvf-student-support.web.app',
  'https://bvf-student-support.firebaseapp.com',
]);

export type StructuredData = Record<string, unknown>;
export type BreadcrumbItem = {
  name: string;
  path: string;
};

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
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  breadcrumb?: BreadcrumbItem[];
};

export function resolveAbsoluteUrl(value?: string) {
  const fallback =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : SITE_URL;
  const candidate = value || fallback;
  const absoluteUrl = new URL(candidate, SITE_URL);
  absoluteUrl.hash = '';
  if (LEGACY_SITE_ORIGINS.has(absoluteUrl.origin)) {
    return new URL(`${absoluteUrl.pathname}${absoluteUrl.search}`, SITE_URL).toString();
  }
  return absoluteUrl.toString();
}

export function resolveKeywords(keywords?: string[]) {
  const defaults = [
    'BVF Germany',
    'study in Germany',
    'German universities for Indian students',
    'Germany admissions guidance',
  ];
  const merged = [...defaults, ...(keywords || [])];
  return Array.from(new Set(merged.map((keyword) => keyword.trim()).filter(Boolean))).join(', ');
}

export function resolveStructuredData(structuredData?: StructuredData | StructuredData[]) {
  if (!structuredData) {
    return [];
  }

  return Array.isArray(structuredData) ? structuredData : [structuredData];
}

export function buildOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: resolveAbsoluteUrl(DEFAULT_LOGO_PATH),
  };
}

export function buildWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: DEFAULT_LANGUAGE,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: resolveAbsoluteUrl(DEFAULT_LOGO_PATH),
      },
    },
  };
}

export function buildBreadcrumbStructuredData(breadcrumb?: BreadcrumbItem[]) {
  if (!breadcrumb?.length) {
    return null;
  }

  const items = [{ name: 'Home', path: '/' }, ...breadcrumb];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: resolveAbsoluteUrl(item.path),
    })),
  };
}

export function buildFaqStructuredData(faqs?: Array<{ q: string; a: string }>) {
  if (!faqs?.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function buildPageStructuredData({
  title,
  description,
  url,
  image,
  type,
  author,
  publishedTime,
  modifiedTime,
  section,
  keywords,
}: {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  keywords?: string[];
}) {
  const canonicalUrl = resolveAbsoluteUrl(url);
  const imageUrl = resolveAbsoluteUrl(image || DEFAULT_OG_IMAGE_PATH);
  const pageType = type === 'article' ? 'Article' : 'WebPage';

  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    headline: title,
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: DEFAULT_LANGUAGE,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: resolveAbsoluteUrl(DEFAULT_LOGO_PATH),
      },
    },
    ...(author
      ? {
          author: {
            '@type': 'Person',
            name: author,
          },
        }
      : {}),
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(keywords?.length ? { keywords: Array.from(new Set(keywords)).join(', ') } : {}),
  };
}
