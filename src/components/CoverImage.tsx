import { useState } from 'react';
import SceneIllustration, { sceneFor } from '@/components/SceneIllustration';
import { cn } from '@/lib/utils';

/** Hosts that serve BVF Germany's own images. */
const OWN_IMAGE_HOSTS = /(^|\.)(bvfgermany\.com|bvf-student-support\.web\.app|bvf-student-support\.firebaseapp\.com|firebasestorage\.googleapis\.com|storage\.googleapis\.com)$/i;

/**
 * True only for images BVF owns: files on this site, Firebase Storage uploads, or data URLs.
 * Images hot-linked from other websites are not shown: they are other companies' pictures,
 * and those sites often block them, which leaves an empty box.
 */
export function isOwnImage(src?: string | null): boolean {
  const value = (src || '').trim();
  if (!value) return false;
  if (value.startsWith('data:image/')) return true;
  // "/src/..." paths only exist in development, never in the built site.
  if (value.startsWith('/')) return !value.startsWith('//') && !value.startsWith('/src/');
  try {
    return OWN_IMAGE_HOSTS.test(new URL(value).hostname);
  } catch {
    return false;
  }
}

type CoverImageProps = {
  src?: string | null;
  title: string;
  /** Size and shape of the cover, for example "h-52 w-full". */
  className?: string;
  /** Extra classes for the <img> when BVF's own image is shown. */
  imageClassName?: string;
  eager?: boolean;
};

/** A blog or webinar cover: BVF's own image when there is one, otherwise a matching illustration. */
export default function CoverImage({ src, title, className, imageClassName, eager = false }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (isOwnImage(src) && !failed) {
    return (
      <img
        src={src as string}
        alt={title}
        className={cn('object-cover', className, imageClassName)}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <SceneIllustration scene={sceneFor(title)} label={`Illustration for ${title}`} />
    </div>
  );
}
