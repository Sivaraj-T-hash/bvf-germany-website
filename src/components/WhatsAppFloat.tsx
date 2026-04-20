import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      drag
      dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 80, bottom: 0 }}
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] cursor-grab active:cursor-grabbing transition-shadow animate-pulse-glow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
    </motion.a>
  );
}
