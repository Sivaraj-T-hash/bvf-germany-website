import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { whatsappLink } from '@/lib/contact';

/** Floating WhatsApp button. Hidden until the official WhatsApp Business number is configured. */
export default function WhatsAppFloat() {
  const settings = useSiteSettings();
  const href = whatsappLink(settings);
  if (!href) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] transition-shadow hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] md:bottom-6 md:right-6"
      aria-label="Chat with BVF Germany on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 fill-current" aria-hidden="true" />
    </motion.a>
  );
}
