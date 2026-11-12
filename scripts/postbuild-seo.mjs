import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_LOGO_PATH,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_ROBOTS,
  DEFAULT_TWITTER_HANDLE,
  SITE_NAME,
  SITE_URL,
  seoRoutes,
} from './seo-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toAbsoluteUrl = (value = '/') => {
  const absoluteUrl = new URL(value, SITE_URL);
  absoluteUrl.hash = '';
  return absoluteUrl.toString();
};

const upsertTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const upsertMeta = (html, attr, name, content) => {
  const metaTag = `<meta ${attr}="${name}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+[^>]*${attr}=["']${escapeRegex(name)}["'][^>]*>`, 'i');
  return regex.test(html) ? html.replace(regex, metaTag) : html.replace('</head>', `    ${metaTag}\n  </head>`);
};

const upsertLink = (html, rel, href) => {
  const linkTag = `<link rel="${rel}" href="${escapeHtml(href)}" />`;
  const regex = new RegExp(`<link\\s+[^>]*rel=["']${escapeRegex(rel)}["'][^>]*>`, 'i');
  return regex.test(html) ? html.replace(regex, linkTag) : html.replace('</head>', `    ${linkTag}\n  </head>`);
};

const stripGeneratedStructuredData = (html) =>
  html.replace(/\s*<script type="application\/ld\+json" data-bvf-static-seo="[^"]+">[\s\S]*?<\/script>/g, '');

const buildOrganizationData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: toAbsoluteUrl(DEFAULT_LOGO_PATH),
});

const buildWebsiteData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(DEFAULT_LOGO_PATH),
    },
  },
});

const buildWebPageData = (route) => ({
  '@context': 'https://schema.org',
  '@type': route.pageType || 'WebPage',
  name: route.name,
  description: route.description,
  url: toAbsoluteUrl(route.path),
  inLanguage: 'en-IN',
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH),
  },
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
  ...(route.keywords?.length ? { keywords: route.keywords.join(', ') } : {}),
  ...(route.mainEntity ? { mainEntity: route.mainEntity } : {}),
});

const buildBreadcrumbData = (route) => {
  if (!route.breadcrumb?.length) {
    return null;
  }

  const items = [
    { name: 'Home', path: '/' },
    ...route.breadcrumb,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
};

const injectStructuredData = (html, route) => {
  const breadcrumbData = buildBreadcrumbData(route);
  const payload = [buildOrganizationData(), buildWebsiteData(), buildWebPageData(route)];
  if (breadcrumbData) {
    payload.push(breadcrumbData);
  }

  const scripts = payload
    .map(
      (item, index) =>
        `    <script type="application/ld+json" data-bvf-static-seo="${index}">${JSON.stringify(item)}</script>`,
    )
    .join('\n');

  return stripGeneratedStructuredData(html).replace('</head>', `${scripts}\n  </head>`);
};

const renderRouteHtml = (template, route) => {
  const keywords = route.keywords?.join(', ') || '';
  let html = template;
  html = upsertTitle(html, route.title);
  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'name', 'keywords', keywords);
  html = upsertMeta(html, 'name', 'robots', DEFAULT_ROBOTS);
  html = upsertMeta(html, 'name', 'googlebot', DEFAULT_ROBOTS);
  html = upsertMeta(html, 'property', 'og:title', route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:type', route.pageType === 'CollectionPage' ? 'website' : 'website');
  html = upsertMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = upsertMeta(html, 'property', 'og:url', toAbsoluteUrl(route.path));
  html = upsertMeta(html, 'property', 'og:image', toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH));
  html = upsertMeta(html, 'property', 'og:image:secure_url', toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH));
  html = upsertMeta(html, 'property', 'og:image:alt', DEFAULT_OG_IMAGE_ALT);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:site', DEFAULT_TWITTER_HANDLE);
  html = upsertMeta(html, 'name', 'twitter:title', route.title);
  html = upsertMeta(html, 'name', 'twitter:description', route.description);
  html = upsertMeta(html, 'name', 'twitter:image', toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH));
  html = upsertMeta(html, 'name', 'twitter:image:alt', DEFAULT_OG_IMAGE_ALT);
  html = upsertLink(html, 'canonical', toAbsoluteUrl(route.path));
  html = injectStructuredData(html, route);
  return html;
};

const template = await readFile(templatePath, 'utf8');

for (const route of seoRoutes) {
  const routeHtml = renderRouteHtml(template, route);
  const routeSegments = route.path.split('/').filter(Boolean);
  const outputDir = routeSegments.length === 0 ? distDir : path.join(distDir, ...routeSegments);

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), routeHtml, 'utf8');
}

