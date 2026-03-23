const logger = require('../utils/logger');

const requests = {};
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

function antispam(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requests[ip]) requests[ip] = [];

  requests[ip] = requests[ip].filter(t => now - t < WINDOW_MS);

  if (requests[ip].length >= MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  requests[ip].push(now);
  next();
}

module.exports = antispam;