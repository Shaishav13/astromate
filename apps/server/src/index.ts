import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generalRateLimit } from './middleware/rateLimit';
import authRouter from './routes/auth';
import onboardRouter from './routes/onboard';
import chatRouter from './routes/chat';
import mateRouter from './routes/mate';
import okfRouter from './routes/okf';
import { startProactiveCron } from './cron/proactive';
import { isOllamaRunning } from './services/ollama';
import { prisma } from '@astromate/db';

const app = express();
const PORT = process.env.SERVER_PORT ?? 3001;

// CORS configuration supporting local dev and Vercel production/preview deployments
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin matches configured origins, localhost, or any Vercel domain
      const isConfigured = configuredOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed));
      const isVercel = origin.endsWith('.vercel.app') || origin.includes('vercel.app');
      const isLocalhost = origin.includes('localhost:') || origin.includes('127.0.0.1:');

      if (isConfigured || isVercel || isLocalhost) {
        return callback(null, true);
      }

      // In self-hosted tunnel mode, permit the caller with credentials
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Bypass-Tunnel-Reminder',
      'bypass-tunnel-reminder',
      'ngrok-skip-browser-warning',
    ],
  })
);
app.options('*', cors());
app.use(express.json({ limit: '10kb' }));
app.use(generalRateLimit);

// Health check
app.get('/api/health', async (_req, res) => {
  const [ollamaOk, dbOk] = await Promise.all([
    isOllamaRunning(),
    prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
  ]);
  const status = ollamaOk && dbOk ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    ollama: ollamaOk,
    db: dbOk,
    timestamp: new Date().toISOString(),
    hint: !ollamaOk ? 'Run: ollama serve' : undefined,
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/onboard', onboardRouter); // kept for backward compat
app.use('/api/chat', chatRouter);
app.use('/api/messages', chatRouter);
app.use('/api/mate', mateRouter);
app.use('/api/okf', okfRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message, stack: err.stack });
  }
);

app.listen(PORT, async () => {
  console.log(`\n\u2728 AstroMate Server on http://localhost:${PORT}`);
  const ollamaOk = await isOllamaRunning();
  if (!ollamaOk) {
    console.warn('\u26a0\ufe0f  Ollama not running. Start: ollama serve');
  } else {
    console.log(`\ud83e\udd16 Ollama ready (${process.env.OLLAMA_MODEL ?? 'llama3'})`);
  }
  startProactiveCron();
});

export default app;
