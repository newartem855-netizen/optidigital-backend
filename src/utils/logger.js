const levels = { info: '✅', warn: '⚠️', error: '❌' };

function log(level, ...args) {
  const time = new Date().toISOString();
  const icon = levels[level] || '•';
  console[level === 'error' ? 'error' : 'log'](`[${time}] ${icon} [${level.toUpperCase()}]`, ...args);
}

const logger = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};

module.exports = logger;