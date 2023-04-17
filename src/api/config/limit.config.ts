import rateLimit from 'express-rate-limit';

export const rateLimiter = () => rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINS) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_FREQUENCY),
    standardHeaders: true, // Passage for `RateLimit-*` headers
    legacyHeaders: false, // Discard `X-RateLimit-*` headers
});

export const DEFAULT_PAGE_SIZE = 1;