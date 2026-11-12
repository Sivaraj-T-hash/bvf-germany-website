import { Router } from 'express';
import { sendAdminBroadcast, sendPublicLeadSubmission, sendSubmissionEmails } from '../controllers/notificationController.js';
import { createRateLimiter } from '../services/rateLimit.js';

const notificationRoutes = Router();

// Public form endpoints: at most 20 requests per IP every 10 minutes (generous because many Indian mobile users share an IP).
const submissionLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many submissions. Please try again in a few minutes.',
});

notificationRoutes.post('/submission-emails', submissionLimiter, sendSubmissionEmails);
notificationRoutes.post('/public-lead', submissionLimiter, sendPublicLeadSubmission);
notificationRoutes.post('/admin-broadcast', sendAdminBroadcast);

export { notificationRoutes };
