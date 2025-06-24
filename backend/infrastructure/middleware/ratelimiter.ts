import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  standardHeaders: true, // `RateLimit-*` headers
  legacyHeaders: false,  // disable `X-RateLimit-*` headers
  message: {
    message: 'Too many requests, please try again in 15 minutes.',
  },
});
