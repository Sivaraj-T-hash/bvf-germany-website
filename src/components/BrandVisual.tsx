import { useId } from 'react';
import { GraduationCap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type BrandVisualProps = {
  title?: string;
  kicker?: string;
  icon?: LucideIcon;
  tone?: 'navy' | 'sand';
  className?: string;
};

/**
 * Branded graphic used wherever a genuine BVF photograph is not available yet.
 * It replaces generic stock and AI-generated images; swap in a real photo when BVF provides one.
 */
export default function BrandVisual({ title, kicker = 'BVF Germany', icon: Icon = GraduationCap, tone = 'navy', className }: BrandVisualProps) {
  const dark = tone === 'navy';
  const patternId = `bvf-grid-${useId().replace(/:/g, '')}`;
  return (
    <div
      role="img"
      aria-label={title || kicker}
      className={cn(
        'relative isolate overflow-hidden',
        dark ? 'bg-[linear-gradient(140deg,#132033_0%,#1c3150_55%,#132033_100%)]' : 'bg-[linear-gradient(140deg,#fff8ee_0%,#f6ead6_100%)]',
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5">
        <span className="flex-1 bg-[#1f2937]" />
        <span className="flex-1 bg-[#dd0000]" />
        <span className="flex-1 bg-[#ffce00]" />
      </div>
      <svg aria-hidden="true" className={cn('absolute inset-0 h-full w-full', dark ? 'opacity-[0.07]' : 'opacity-[0.12]')}>
        <defs>
          <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke={dark ? '#ffffff' : '#132033'} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div aria-hidden="true" className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-[#facc15]/20 blur-3xl" />
      <div aria-hidden="true" className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#ff9933]/10 blur-3xl" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 md:p-8">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl ring-1', dark ? 'bg-white/10 ring-white/20' : 'bg-white ring-[#eadfcd]')}>
          <Icon className={cn('h-6 w-6', dark ? 'text-[#facc15]' : 'text-secondary')} aria-hidden="true" />
        </span>
        <p className={cn('mt-4 text-[11px] font-semibold uppercase tracking-[0.24em]', dark ? 'text-[#facc15]' : 'text-secondary')}>{kicker}</p>
        {title ? <p className={cn('mt-2 max-w-md font-heading text-2xl font-semibold leading-tight md:text-3xl', dark ? 'text-white' : 'text-foreground')}>{title}</p> : null}
      </div>
    </div>
  );
}
