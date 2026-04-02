// Dynamically loads the system prompt based on PROJECT_ID env var.
// To add a new project: create src/config/prompts/<your-id>.js
// then set PROJECT_ID=<your-id> in .env

const config = require('../config');

let projectPrompt;
try {
  projectPrompt = require(`../config/prompts/${config.project}`);
} catch {
  projectPrompt = require('../config/prompts/default');
}

const { SYSTEM_PROMPT } = projectPrompt;

function buildPrompt(history, userMessage) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];
}

module.exports = { buildPrompt, SYSTEM_PROMPT };
