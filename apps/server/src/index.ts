import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generalRateLimit } from './middleware/rateLimit';
import onboardRouter from './routes/onboard';
import chatRouter from './routes/chat';
import mateRouter from './routes/mate';
import { startProactiveCron } from './cron/proactive';
import { isOllamaRunning } from './services/ollama';
import { prisma } from '@astromate/db';

const app = express();
const PORT = process.env.SERVER_PORT ?? 3001;

// ============================================
// Middleware
// ============================================
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(generalRateLimit);

// ============================================
// Routes
// ============================================

/** Health check - useful for deployment and debugging */
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
    hint: !ollamaOk
      ? 'Ollama not running. Start with: ollama serve'
      : undefined,
  });
});

app.use('/api/onboard', onboardRouter);
app.use('/api/chat', chatRouter);
app.use('/api/messages', chatRouter);
app.use('/api/mate', mateRouter);

/** 404 handler */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/** Global error handler */
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// ============================================
// Start
// ============================================
app.listen(PORT, async () => {
  console.log(`
\u2728 AstroMate Server running on http://localhost:${PORT}
\ud83d\udcca Health check: http://localhost:${PORT}/api/health
  `);

  const ollamaOk = await isOllamaRunning();
  if (!ollamaOk) {
    console.warn(
      '\n\u26a0\ufe0f  Ollama is not running!\n   Start it with: ollama serve\n   Then pull a model: ollama pull llama3\n'
    );
  } else {
    console.log(`\ud83e\udd16 Ollama connected (model: ${process.env.OLLAMA_MODEL ?? 'llama3'})`);
  }

  startProactiveCron();
});

export default app;
