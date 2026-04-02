const OpenAI = require('openai');
const { buildPrompt } = require('./prompt');
const config = require('../config');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCompletion(history, userMessage) {
  const messages = buildPrompt(history, userMessage);

  const response = await openai.chat.completions.create({
    model: config.openai.model,
    temperature: config.openai.temperature,
    max_tokens: config.openai.maxTokens,
    messages,
  });

  return response.choices[0].message.content;
}

module.exports = { getCompletion };
