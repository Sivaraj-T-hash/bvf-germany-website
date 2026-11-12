import type { SiteSettings } from '@/lib/siteContentStore';
import { businessInfo } from '@/config/business';
import { cleanContactValue } from '@/lib/contact';

export const DEFAULT_WHATSAPP_MESSAGE = businessInfo.whatsappMessage;
/** Official BVF WhatsApp Business number (from src/config/business.ts). */
export const DEFAULT_WHATSAPP_NUMBER = businessInfo.whatsappNumber;

type WhatsappSettings = Pick<SiteSettings, 'whatsappNumber' | 'prefilledWhatsappMessage'> | null | undefined;

/** Number saved in Admin → Settings, unless it is empty or a placeholder; otherwise the official number. */
export function getWhatsappNumber(settings?: WhatsappSettings): string {
  const saved = cleanContactValue(settings?.whatsappNumber || '');
  return (saved || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
}

export function getWhatsappMessage(settings?: WhatsappSettings, overrideMessage?: string): string {
  const preferredMessage = overrideMessage?.trim() || settings?.prefilledWhatsappMessage?.trim();
  return preferredMessage || DEFAULT_WHATSAPP_MESSAGE;
}

export function buildWhatsappHref(settings?: WhatsappSettings, overrideMessage?: string): string {
  const whatsappNumber = getWhatsappNumber(settings);
  const message = encodeURIComponent(getWhatsappMessage(settings, overrideMessage));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
