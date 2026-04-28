import { createLeadRecord } from '@/lib/leadStore';

const apiBase = (import.meta.env.VITE_AUTH_API_BASE_URL || '').replace(/\/$/, '');

type FormType = 'contact' | 'booking' | 'webinar' | 'profile_evaluation';

type SubmissionEmailInput = {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  subject?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  webinarTitle?: string;
  webinarDate?: string;
  qualification?: string;
  intake?: string;
  planningYear?: string;
  interestedProgram?: string;
  currentEducation?: string;
};

export async function sendSubmissionEmails(input: SubmissionEmailInput): Promise<void> {
  const response = await fetch(`${apiBase}/api/notifications/submission-emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const json = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(json.message || 'Failed to send notification emails.');
  }
}

type PublicLeadSubmissionApiInput = {
  formType: 'profile_evaluation';
  source: 'contact' | 'pricing' | 'tool';
  sourcePage: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  interestedProgram: string;
  currentEducation: string;
  metadata?: Record<string, string>;
  website?: string;
};

async function fallbackPublicLeadSubmission(
  input: PublicLeadSubmissionApiInput,
): Promise<{ emailSent: boolean; leadId: string }> {
  const lead = await createLeadRecord({
    source: input.source,
    sourcePage: input.sourcePage,
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.subject,
    message: input.message,
    metadata: input.metadata,
  });

  try {
    await sendSubmissionEmails({
      formType: input.formType,
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      interestedProgram: input.interestedProgram,
      currentEducation: input.currentEducation,
    });

    return { emailSent: true, leadId: lead.id };
  } catch (error) {
    console.warn('Public lead email notifications skipped after fallback lead save', error);
    return { emailSent: false, leadId: lead.id };
  }
}

export async function submitPublicLeadRequest(
  input: PublicLeadSubmissionApiInput,
): Promise<{ emailSent: boolean; leadId: string }> {
  try {
    const response = await fetch(`${apiBase}/api/notifications/public-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const json = (await response.json().catch(() => ({}))) as {
      message?: string;
      emailSent?: boolean;
      leadId?: string;
    };

    if (!response.ok) {
      if (response.status >= 500 || response.status === 404) {
        return fallbackPublicLeadSubmission(input);
      }

      throw new Error(json.message || 'Failed to submit lead.');
    }

    return {
      emailSent: Boolean(json.emailSent),
      leadId: String(json.leadId || ''),
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to fetch') {
      return fallbackPublicLeadSubmission(input);
    }

    throw error;
  }
}

type AdminBroadcastInput = {
  idToken: string;
  eventType: 'blog' | 'webinar';
  title: string;
  ctaUrl: string;
  testOnly?: boolean;
};

export async function sendAdminBroadcastEmails(input: AdminBroadcastInput): Promise<{ sent: number }> {
  const response = await fetch(`${apiBase}/api/notifications/admin-broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const json = (await response.json().catch(() => ({}))) as { message?: string; sent?: number };
  if (!response.ok) {
    throw new Error(json.message || 'Failed to send admin broadcast emails.');
  }

  return { sent: Number(json.sent || 0) };
}
