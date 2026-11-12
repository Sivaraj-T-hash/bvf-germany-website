import { GraduationCap, type LucideIcon } from 'lucide-react';
import SceneIllustration, { sceneFor, type SceneName } from '@/components/SceneIllustration';
import { cn } from '@/lib/utils';

type BrandVisualProps = {
  title?: string;
  kicker?: string;
  icon?: LucideIcon;
  tone?: 'navy' | 'sand';
  /** Illustration to show. Picked from the title and kicker when left out. */
  scene?: SceneName;
  /** Hide the caption and show the illustration only. */
  bare?: boolean;
  className?: string;
};

/**
 * Illustration used wherever a genuine BVF photograph is not available yet.
 * It shows places and objects only (no people); swap in a real photo when BVF provides one.
 */
export default function BrandVisual({ title, kicker = 'BVF Germany', icon: Icon = GraduationCap, tone = 'navy', scene, bare = false, className }: BrandVisualProps) {
  const chosenScene = scene || sceneFor(`${kicker} ${title || ''}`);
  const dark = tone === 'navy';
  return (
    <div role="img" aria-label={title || kicker} className={cn('relative isolate overflow-hidden bg-[#fff7e6]', className)}>
      <SceneIllustration scene={chosenScene} className="absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5">
        <span className="flex-1 bg-[#1f2937]" />
        <span className="flex-1 bg-[#dd0000]" />
        <span className="flex-1 bg-[#ffce00]" />
      </div>
      {bare ? null : (
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <div className={cn('inline-flex max-w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-lg backdrop-blur', dark ? 'bg-[#132033]/88 text-white' : 'bg-white/90 text-foreground')}>
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', dark ? 'bg-white/10' : 'bg-[#fff4db]')}>
              <Icon className={cn('h-5 w-5', dark ? 'text-[#facc15]' : 'text-secondary')} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.22em]', dark ? 'text-[#facc15]' : 'text-secondary')}>{kicker}</span>
              {title ? <span className="block truncate text-sm font-semibold md:text-base">{title}</span> : null}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
