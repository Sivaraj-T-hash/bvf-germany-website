import type { SiteSettings } from '@/lib/siteContentStore';

export const DEFAULT_WHATSAPP_MESSAGE = 'Hi BVF Germany! I want to know more about studying in Germany';
export const DEFAULT_WHATSAPP_NUMBER = '919999999999';

type WhatsappSettings = Pick<SiteSettings, 'whatsappNumber' | 'prefilledWhatsappMessage'> | null | undefined;

export function getWhatsappNumber(settings?: WhatsappSettings): string {
  return (settings?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
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
