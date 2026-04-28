import { Router } from 'express';
import { sendAdminBroadcast, sendPublicLeadSubmission, sendSubmissionEmails } from '../controllers/notificationController.js';

const notificationRoutes = Router();

notificationRoutes.post('/submission-emails', sendSubmissionEmails);
notificationRoutes.post('/public-lead', sendPublicLeadSubmission);
notificationRoutes.post('/admin-broadcast', sendAdminBroadcast);

export { notificationRoutes };
