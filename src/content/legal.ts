/**
 * Legal page content supplied by BVF Germany.
 *
 * Terms of Service and the Refund & Cancellation Policy are business decisions, so they are not written
 * by the developer. Paste the approved text here as sections. A page and its footer link appear only
 * once its sections are filled in.
 *
 * Example section:
 * { heading: 'Cancellations', paragraphs: ['First paragraph…', 'Second paragraph…'] }
 */
export type LegalSection = { heading: string; paragraphs: string[] };

export const legalContent = {
  /** Date the texts below were last approved, e.g. '11 November 2026'. */
  lastUpdated: '',
  terms: [] as LegalSection[],
  refundPolicy: [] as LegalSection[],
};

export const hasTerms = legalContent.terms.length > 0;
export const hasRefundPolicy = legalContent.refundPolicy.length > 0;
