const sessions = {};
const MAX_HISTORY = 20;

function getMemory(sessionId) {
  return sessions[sessionId] || [];
}

function saveMemory(sessionId, userMessage, assistantReply) {
  if (!sessions[sessionId]) sessions[sessionId] = [];

  sessions[sessionId].push(
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantReply }
  );

  if (sessions[sessionId].length > MAX_HISTORY) {
    sessions[sessionId] = sessions[sessionId].slice(-MAX_HISTORY);
  }
}

function clearMemory(sessionId) {
  delete sessions[sessionId];
}

module.exports = { getMemory, saveMemory, clearMemory };