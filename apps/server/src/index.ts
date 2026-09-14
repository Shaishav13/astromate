import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generalRateLimit } from './middleware/rateLimit';
import authRouter from './routes/auth';
import onboardRouter from './routes/onboard';
import chatRouter from './routes/chat';
import mateRouter from './routes/mate';
import { startProactiveCron } from './cron/proactive';
import { isOllamaRunning } from './services/ollama';
import { prisma } from '@astromate/db';

const app = express();
const PORT = process.env.SERVER_PORT ?? 3001;

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);
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

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
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
