import { useEffect } from 'react';
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_ROBOTS,
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
}: SeoOptions) => {
  useEffect(() => {
    const canonicalUrl = resolveAbsoluteUrl(url);
    const imageUrl = resolveAbsoluteUrl(image);
    const keywordContent = resolveKeywords(keywords);
    const robotsContent = noindex ? 'noindex, nofollow' : robots || DEFAULT_ROBOTS;
    const googlebotContent = noindex ? 'noindex, nofollow' : googlebot || robotsContent;
    const structuredDataItems = resolveStructuredData(structuredData);

    document.title = title;

    ensureMeta('description').setAttribute('content', description);
    ensureMeta('keywords').setAttribute('content', keywordContent);
    ensureMeta('robots').setAttribute('content', robotsContent);
    ensureMeta('googlebot').setAttribute('content', googlebotContent);
    ensureMeta('og:title', 'property').setAttribute('content', title);
    ensureMeta('og:description', 'property').setAttribute('content', description);
    ensureMeta('og:type', 'property').setAttribute('content', type);
    ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);
    ensureMeta('og:site_name', 'property').setAttribute('content', SITE_NAME);
    ensureMeta('og:image', 'property').setAttribute('content', imageUrl);
    ensureMeta('og:image:secure_url', 'property').setAttribute('content', imageUrl);
    ensureMeta('og:image:alt', 'property').setAttribute('content', imageAlt);
    ensureMeta('twitter:card').setAttribute('content', 'summary_large_image');
    ensureMeta('twitter:site').setAttribute('content', DEFAULT_TWITTER_HANDLE);
    ensureMeta('twitter:title').setAttribute('content', title);
    ensureMeta('twitter:description').setAttribute('content', description);
    ensureMeta('twitter:image').setAttribute('content', imageUrl);
    ensureMeta('twitter:image:alt').setAttribute('content', imageAlt);
    ensureLink('canonical').setAttribute('href', canonicalUrl);

    document
      .querySelectorAll('script[data-bvf-seo-ld]')
      .forEach((node) => node.parentNode?.removeChild(node));

    structuredDataItems.forEach((item, index) => {
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
    robots,
    structuredData,
    title,
    type,
    url,
  ]);
};
