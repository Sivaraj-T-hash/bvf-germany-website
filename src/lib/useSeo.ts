import { useEffect } from 'react';
import {
  buildBreadcrumbStructuredData,
  buildOrganizationStructuredData,
  buildPageStructuredData,
  buildWebsiteStructuredData,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_LANGUAGE,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_ROBOTS,
  DEFAULT_THEME_COLOR,
  DEFAULT_TWITTER_HANDLE,
  SITE_NAME,
  type SeoOptions,
  resolveAbsoluteUrl,
  resolveKeywords,
  resolveStructuredData,
} from '@/lib/seo';

const ensureMeta = (name: string, attr: 'name' | 'property' = 'name') => {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  return tag as HTMLMetaElement;
};

const clearMeta = (name: string, attr: 'name' | 'property' = 'name') => {
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
};

const ensureLink = (rel: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  return link as HTMLLinkElement;
};

export const useSeo = ({
  title,
  description,
  url,
  image = DEFAULT_OG_IMAGE_PATH,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  keywords,
  type = 'website',
  robots,
  googlebot,
  noindex = false,
  structuredData,
  author,
  publishedTime,
  modifiedTime,
  section,
  breadcrumb,
}: SeoOptions) => {
  useEffect(() => {
    const canonicalUrl = resolveAbsoluteUrl(url);
    const imageUrl = resolveAbsoluteUrl(image);
    const keywordContent = resolveKeywords(keywords);
    const robotsContent = noindex ? 'noindex, nofollow' : robots || DEFAULT_ROBOTS;
    const googlebotContent = noindex ? 'noindex, nofollow' : googlebot || robotsContent;
    const structuredDataItems = resolveStructuredData(structuredData);
    const baseStructuredData = noindex
      ? []
      : [
          buildOrganizationStructuredData(),
          buildWebsiteStructuredData(),
          buildPageStructuredData({
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
          }),
          buildBreadcrumbStructuredData(breadcrumb),
        ].filter(Boolean);
    const combinedStructuredData = [...baseStructuredData, ...structuredDataItems];

    document.title = title;

    ensureMeta('description').setAttribute('content', description);
    ensureMeta('keywords').setAttribute('content', keywordContent);
    ensureMeta('author').setAttribute('content', author || SITE_NAME);
    ensureMeta('publisher').setAttribute('content', SITE_NAME);
    ensureMeta('referrer').setAttribute('content', 'strict-origin-when-cross-origin');
    ensureMeta('theme-color').setAttribute('content', DEFAULT_THEME_COLOR);
    ensureMeta('application-name').setAttribute('content', SITE_NAME);
    ensureMeta('apple-mobile-web-app-title').setAttribute('content', SITE_NAME);
    ensureMeta('robots').setAttribute('content', robotsContent);
    ensureMeta('googlebot').setAttribute('content', googlebotContent);
    ensureMeta('og:title', 'property').setAttribute('content', title);
    ensureMeta('og:description', 'property').setAttribute('content', description);
    ensureMeta('og:type', 'property').setAttribute('content', type);
    ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);
    ensureMeta('og:site_name', 'property').setAttribute('content', SITE_NAME);
    ensureMeta('og:locale', 'property').setAttribute('content', DEFAULT_LOCALE);
    ensureMeta('og:image', 'property').setAttribute('content', imageUrl);
    ensureMeta('og:image:secure_url', 'property').setAttribute('content', imageUrl);
    ensureMeta('og:image:alt', 'property').setAttribute('content', imageAlt);
    ensureMeta('twitter:card').setAttribute('content', 'summary_large_image');
    ensureMeta('twitter:site').setAttribute('content', DEFAULT_TWITTER_HANDLE);
    ensureMeta('twitter:creator').setAttribute('content', DEFAULT_TWITTER_HANDLE);
    ensureMeta('twitter:title').setAttribute('content', title);
    ensureMeta('twitter:description').setAttribute('content', description);
    ensureMeta('twitter:image').setAttribute('content', imageUrl);
    ensureMeta('twitter:image:alt').setAttribute('content', imageAlt);
    ensureMeta('language').setAttribute('content', DEFAULT_LANGUAGE);
    ensureMeta('article:author', 'property').setAttribute('content', author || SITE_NAME);
    if (publishedTime) {
      ensureMeta('article:published_time', 'property').setAttribute('content', publishedTime);
    } else {
      clearMeta('article:published_time', 'property');
    }
    if (modifiedTime) {
      ensureMeta('article:modified_time', 'property').setAttribute('content', modifiedTime);
    } else {
      clearMeta('article:modified_time', 'property');
    }
    if (section) {
      ensureMeta('article:section', 'property').setAttribute('content', section);
    } else {
      clearMeta('article:section', 'property');
    }
    ensureLink('canonical').setAttribute('href', canonicalUrl);

    document
      .querySelectorAll('script[data-bvf-seo-ld]')
      .forEach((node) => node.parentNode?.removeChild(node));

    combinedStructuredData.forEach((item, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.bvfSeoLd = String(index);
      script.text = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [
    description,
    googlebot,
    image,
    imageAlt,
    keywords,
    noindex,
    author,
    breadcrumb,
    robots,
    modifiedTime,
    publishedTime,
    section,
    structuredData,
    title,
    type,
    url,
  ]);
};
