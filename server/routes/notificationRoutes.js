import { Router } from 'express';
import { sendAdminBroadcast, sendSubmissionEmails } from '../controllers/notificationController.js';

const notificationRoutes = Router();

notificationRoutes.post('/submission-emails', sendSubmissionEmails);
notificationRoutes.post('/admin-broadcast', sendAdminBroadcast);

export { notificationRoutes };
