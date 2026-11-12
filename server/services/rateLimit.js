// Small in-memory rate limiter (one Render instance). Keyed by client IP.
export function createRateLimiter({ windowMs, max, message }) {
  const hits = new Map();

  return function rateLimit(req, res, next) {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

    if (recent.length >= max) {
      res.status(429).json({ success: false, message });
      return;
    }

    recent.push(now);
    hits.set(key, recent);

    // Keep the map from growing without bound.
    if (hits.size > 5000) {
      for (const [entryKey, timestamps] of hits) {
        if (!timestamps.some((timestamp) => now - timestamp < windowMs)) hits.delete(entryKey);
      }
    }

    next();
  };
}
