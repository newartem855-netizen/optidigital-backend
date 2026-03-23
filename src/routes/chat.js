const express = require('express');
const router = express.Router();
const antispam = require('../middleware/antispam');
const { getCompletion } = require('../services/openai');
const { getMemory, saveMemory } = require('../services/memory');
const { buildPrompt } = require('../services/prompt');
const logger = require('../utils/logger');

router.post('/', antispam, async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    const history = getMemory(sessionId);
    const prompt = buildPrompt(history, message);
    const reply = await getCompletion(prompt);

    saveMemory(sessionId, message, reply);

    res.json({ reply });
  } catch (err) {
    logger.error('Chat error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;