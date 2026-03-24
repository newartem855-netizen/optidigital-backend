const OpenAI = require('openai');
const { buildPrompt } = require('./prompt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCompletion(history, userMessage) {
  const messages = buildPrompt(history, userMessage);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
  });

  return response.choices[0].message.content;
}

module.exports = { getCompletion };
