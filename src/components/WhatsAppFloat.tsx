import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { subscribeToSiteSettings, type SiteSettings } from '@/lib/siteContentStore';

export default function WhatsAppFloat() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => subscribeToSiteSettings(setSettings), []);

  const href = useMemo(() => {
    const phone = settings?.whatsappNumber || '919999999999';
    const message = encodeURIComponent(settings?.prefilledWhatsappMessage || 'Hi BVF Germany! I want help with studying in Germany.');
    return `https://wa.me/${phone}?text=${message}`;
  }, [settings]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-accent text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
