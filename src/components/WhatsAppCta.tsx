import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { whatsappLink } from '@/lib/contact';
import { cn } from '@/lib/utils';

type WhatsAppCtaProps = {
  message?: string;
  label?: string;
  className?: string;
  variant?: 'solid' | 'outline' | 'link';
};

/** WhatsApp enquiry button. Renders nothing until the official number is configured. */
export default function WhatsAppCta({ message, label = 'Ask on WhatsApp', className, variant = 'solid' }: WhatsAppCtaProps) {
  const settings = useSiteSettings();
  const href = whatsappLink(settings, message);
  if (!href) return null;

  const styles = {
    solid: 'inline-flex items-center justify-center gap-2 rounded-full bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#15803d]',
    outline: 'inline-flex items-center justify-center gap-2 rounded-full border border-[#16a34a]/40 bg-white px-5 py-3 text-sm font-semibold text-[#15803d] transition hover:-translate-y-0.5',
    link: 'inline-flex items-center gap-2 text-sm font-semibold text-[#15803d] transition hover:text-[#166534]',
  } as const;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(styles[variant], className)}>
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
