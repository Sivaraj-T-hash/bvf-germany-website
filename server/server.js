import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';

const app = express();
const port = Number(process.env.PORT || 5000);

const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors(
    corsOrigin
      ? {
          origin: corsOrigin,
        }
      : undefined,
  ),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(port, () => {
  console.log(`Auth API running on port ${port}`);
});
