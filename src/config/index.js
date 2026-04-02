module.exports = {
  // Which project prompt to load — set PROJECT_ID in .env
  // Must match a filename in src/config/prompts/
  project: process.env.PROJECT_ID || 'default',

  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
  },

  memory: {
    maxHistory: parseInt(process.env.MAX_HISTORY) || 20,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_WINDOW_MS) || 60 * 1000,
    maxRequests: parseInt(process.env.RATE_MAX_REQUESTS) || 20,
  },
};
