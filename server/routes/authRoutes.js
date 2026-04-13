import { Router } from 'express';
import { changePassword, forgotPassword, passwordStatus, sendWelcomeSignupEmail } from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/password-status', passwordStatus);
authRoutes.post('/change-password', changePassword);
authRoutes.post('/send-welcome-email', sendWelcomeSignupEmail);

export { authRoutes };
