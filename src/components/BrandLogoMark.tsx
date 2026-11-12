import logo from '@/assets/Logo.png';
import { cn } from '@/lib/utils';

type BrandLogoMarkProps = {
  wrapperClassName?: string;
  imageClassName?: string;
};

export default function BrandLogoMark({
  wrapperClassName,
  imageClassName,
}: BrandLogoMarkProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[#e7dccd] bg-white shadow-sm',
        wrapperClassName,
      )}
    >
      <img
        src={logo}
        alt="BVF Germany logo"
        className={cn(
          'h-full w-full scale-[1.28] object-cover object-center',
          imageClassName,
        )}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
