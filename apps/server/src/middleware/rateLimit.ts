import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for the chat endpoint.
 * Free tier: 20 messages per hour per IP.
 * Prevents abuse without requiring paid services.
 */
export const chatRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many messages. Free tier allows 20 messages per hour. Pro tier coming soon!',
    retryAfter: 'Check the Retry-After header for when you can message again.',
  },
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  },
});

/**
 * General API rate limiter.
 * 100 requests per 15 minutes per IP.
 */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
