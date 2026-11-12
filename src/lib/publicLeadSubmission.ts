import { createLeadRecord, type LeadSource } from '@/lib/leadStore';
import { sendSubmissionEmails } from '@/lib/submissionEmailApi';

export const publicLeadSubmitStorageKey = 'bvf_last_submit';
export const publicLeadSubmitCooldownMs = 30_000;

type PublicLeadSubmissionInput = {
  source?: LeadSource;
  sourcePage: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  userId?: string | null;
  metadata?: Record<string, string>;
  /** When the visitor ticked the consent box (ISO time). */
  consentAt?: string;
};

type PublicLeadSubmissionResult = {
  emailSent: boolean;
};

export function getPublicLeadCooldownMessage(
  storageKey = publicLeadSubmitStorageKey,
  cooldownMs = publicLeadSubmitCooldownMs,
): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const lastSubmit = Number(window.localStorage.getItem(storageKey) || '0');
  const elapsedMs = Date.now() - lastSubmit;
  const remainingMs = cooldownMs - elapsedMs;

  if (remainingMs <= 0) {
    return '';
  }

  return `Please wait ${Math.ceil(remainingMs / 1000)} seconds before submitting again.`;
}

export function markPublicLeadSubmitted(storageKey = publicLeadSubmitStorageKey): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, Date.now().toString());
}

export async function submitPublicLead(input: PublicLeadSubmissionInput): Promise<PublicLeadSubmissionResult> {
  await createLeadRecord({
    source: input.source || 'contact',
    sourcePage: input.sourcePage,
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.subject,
    message: input.message,
    userId: input.userId || null,
    metadata: input.metadata,
    consentAt: input.consentAt,
  });

  try {
    await sendSubmissionEmails({
      formType: 'contact',
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    });

    return { emailSent: true };
  } catch (error) {
    console.warn('Lead email notifications skipped', error);
    return { emailSent: false };
  }
}
