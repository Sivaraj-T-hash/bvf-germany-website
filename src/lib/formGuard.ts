import { useRef } from 'react';

const MIN_FILL_MS = 2500;
const RESUBMIT_WINDOW_MS = 30_000;

/**
 * Lightweight spam protection shared by all public forms:
 * - a hidden honeypot field (`website`) that people never fill in,
 * - a minimum time between opening the form and submitting it,
 * - a 30-second resubmission limit per form in this browser.
 * Returns an error message to show, or null when the submission may proceed.
 */
export function useFormGuard(formKey: string) {
  const startedAt = useRef(Date.now());
  const storageKey = `bvf_last_submit_${formKey}`;

  const check = (honeypotValue?: string): string | null => {
    if (honeypotValue) return 'Submission failed. Please try again.';
    if (Date.now() - startedAt.current < MIN_FILL_MS) return 'Please take a moment to review your details, then submit again.';
    try {
      const last = Number(localStorage.getItem(storageKey) || '0');
      if (Date.now() - last < RESUBMIT_WINDOW_MS) return 'Please wait 30 seconds before submitting again.';
    } catch {
      // Storage unavailable (private mode): skip the per-browser limit.
    }
    return null;
  };

  const markSubmitted = () => {
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      // ignore
    }
    startedAt.current = Date.now();
  };

  return { check, markSubmitted };
}
