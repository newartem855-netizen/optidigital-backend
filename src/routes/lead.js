const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    logger.info(`New lead: ${name} <${email}>`);

    res.json({ success: true, message: 'Lead received' });
  } catch (err) {
    logger.error('Lead error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;