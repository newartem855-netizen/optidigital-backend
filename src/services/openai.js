const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = require('./prompt');

async function generateReply({ history, message }) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message },
  ];

  const response = await client.chat.completions.create({
    model:       'gpt-4o',
    messages,
    max_tokens:  400,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateReply };
