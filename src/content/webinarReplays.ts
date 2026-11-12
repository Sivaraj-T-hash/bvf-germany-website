/**
 * Recorded BVF webinars shown on the home and Webinars pages.
 * Add only genuine BVF recordings (the YouTube video ID is the part after "v=" in the link).
 * The replay sections stay hidden while this list is empty.
 *
 * Example:
 * { id: 'aps-guide-2026', title: 'APS Certificate Full Guide', youtubeId: 'XXXXXXXXXXX', duration: '29 min', description: '…' },
 */
export type WebinarReplay = {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  description: string;
};

export const webinarReplays: WebinarReplay[] = [];
