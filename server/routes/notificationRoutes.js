import { Router } from 'express';
import { sendAdminBroadcast, sendSubmissionEmails } from '../controllers/notificationController.js';
import { createRateLimiter } from '../services/rateLimit.js';

const notificationRoutes = Router();

// Public form notifications: at most 20 per IP every 10 minutes (generous because many Indian mobile users share an IP).
const submissionLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many submissions. Please try again in a few minutes.',
});

notificationRoutes.post('/submission-emails', submissionLimiter, sendSubmissionEmails);
notificationRoutes.post('/admin-broadcast', sendAdminBroadcast);

export { notificationRoutes };
