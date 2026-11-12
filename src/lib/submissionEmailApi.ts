const apiBase = (import.meta.env.VITE_AUTH_API_BASE_URL || '').replace(/\/$/, '');

type FormType = 'contact' | 'booking' | 'webinar' | 'pricing' | 'tool' | 'order';

type SubmissionEmailInput = {
  formType: FormType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  webinarTitle?: string;
  webinarDate?: string;
  qualification?: string;
  intake?: string;
  planningYear?: string;
  selectedPackage?: string;
  source?: string;
  orderTitle?: string;
  amountLabel?: string;
  orderId?: string;
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
