import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';

const app = express();
const port = Number(process.env.PORT || 5000);

const normalizeOrigin = (value) => String(value || '').trim().replace(/\/+$/, '').toLowerCase();
const allowedOrigins = Array.from(
  new Set(
    String(process.env.CORS_ORIGIN || '')
      .split(/[,\n]/)
      .map((value) => normalizeOrigin(value))
      .filter(Boolean),
  ),
);

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin(origin, callback) {
            if (!origin) {
              callback(null, true);
              return;
            }

            const requestOrigin = normalizeOrigin(origin);
            if (allowedOrigins.includes(requestOrigin)) {
              callback(null, true);
              return;
            }

            callback(new Error('Not allowed by CORS'), false);
          },
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
