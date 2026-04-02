const logger = require('../utils/logger');
const config = require('../config');

const { windowMs, maxRequests } = config.rateLimit;
const requests = {};

function antispam(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requests[ip]) requests[ip] = [];

  requests[ip] = requests[ip].filter(t => now - t < windowMs);

  if (requests[ip].length >= maxRequests) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  requests[ip].push(now);
  next();
}

module.exports = antispam;