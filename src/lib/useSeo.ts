import { useEffect } from 'react';

type SeoOptions = {
  title: string;
  description: string;
  url?: string;
  image?: string;
};

const ensureMeta = (name: string, attr: 'name' | 'property' = 'name') => {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  return tag as HTMLMetaElement;
};

export const useSeo = ({ title, description, url, image }: SeoOptions) => {
  useEffect(() => {
    document.title = title;

    ensureMeta('description').setAttribute('content', description);
    ensureMeta('og:title', 'property').setAttribute('content', title);
    ensureMeta('og:description', 'property').setAttribute('content', description);
    if (url) ensureMeta('og:url', 'property').setAttribute('content', url);
    if (image) {
      ensureMeta('og:image', 'property').setAttribute('content', image);
      ensureMeta('twitter:image').setAttribute('content', image);
    }
  }, [title, description, url, image]);
};
