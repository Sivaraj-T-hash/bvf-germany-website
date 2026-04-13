import { PlayCircle, ArrowUpRight } from 'lucide-react';

type VideoPreviewCardProps = {
  title: string;
  description?: string;
  videoId: string;
  href: string;
};

export default function VideoPreviewCard({ title, description, videoId, href }: VideoPreviewCardProps) {
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-[28px] border border-border/90 bg-white/88 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative">
        <img src={thumbnail} alt={title} className="aspect-video w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#162032]/22 transition-colors duration-300 group-hover:bg-[#162032]/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-foreground shadow-card transition-transform duration-300 group-hover:scale-105">
            <PlayCircle className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-[1.9rem] font-semibold leading-none text-foreground">{title}</h3>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        {description ? <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p> : null}
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Opens on YouTube</p>
      </div>
    </a>
  );
}
