import { businessInfo } from '@/config/business';

type WhatsappSource = { whatsappNumber?: string; prefilledWhatsappMessage?: string } | null | undefined;

/** Values that were used as placeholders in earlier versions and must never be published. */
const PLACEHOLDER_PATTERNS = [/9{5}\s?9{5}/, /^\+?91\s?9{5}/, /^https?:\/\/(www\.)?instagram\.com\/?$/i, /^https?:\/\/(www\.)?youtube\.com\/?$/i, /your-username/i, /example\.(com|test)/i];

export const isPlaceholderValue = (value: string | undefined | null) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
};

/** Returns a cleaned value, or '' when the value is missing or a known placeholder. */
export const cleanContactValue = (value: string | undefined | null) => (isPlaceholderValue(value) ? '' : String(value).trim());

/**
 * Builds a WhatsApp chat link. Returns null when no confirmed number is available,
 * so callers can hide the button instead of linking to a placeholder.
 */
export function whatsappLink(settings: WhatsappSource, message?: string): string | null {
  const number = cleanContactValue(settings?.whatsappNumber);
  const digits = number.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const text = message || settings?.prefilledWhatsappMessage || businessInfo.whatsappMessage;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function phoneLink(phone: string | undefined | null): string | null {
  const cleaned = cleanContactValue(phone);
  if (!cleaned) return null;
  return `tel:${cleaned.replace(/[^\d+]/g, '')}`;
}

export function emailLink(email: string | undefined | null): string | null {
  const cleaned = cleanContactValue(email);
  if (!cleaned || !cleaned.includes('@')) return null;
  return `mailto:${cleaned}`;
}

export function externalUrl(url: string | undefined | null): string | null {
  const cleaned = cleanContactValue(url);
  return /^https?:\/\//i.test(cleaned) ? cleaned : null;
}
