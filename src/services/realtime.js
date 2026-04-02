const { SYSTEM_PROMPT } = require('./prompt');
const WebSocket = require('ws');
const logger = require('../utils/logger');

function handleRealtimeProxy(clientWs) {
  let openaiWs = null;
  let closing = false; // guard against double-close loops

  openaiWs = new WebSocket(
    'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    }
  );

  openaiWs.on('open', () => {
    logger.info('Connected to OpenAI Realtime');

    openaiWs.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['audio', 'text'],
        instructions: SYSTEM_PROMPT,
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 600,
        },
      },
    }));
  });

  // Forward every OpenAI event to the client as-is
  openaiWs.on('message', (data) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  // Forward every client message to OpenAI
  clientWs.on('message', (data) => {
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(data);
    }
  });

  // Client disconnected → close OpenAI side
  clientWs.on('close', () => {
    logger.info('Voice client disconnected');
    if (!closing) {
      closing = true;
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    }
  });

  // OpenAI disconnected → close client side (only if client is still open)
  openaiWs.on('close', (code, reason) => {
    logger.info(`OpenAI Realtime disconnected: ${code}`);
    if (!closing) {
      closing = true;
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
    }
  });

  // OpenAI WS error → log and close client cleanly
  openaiWs.on('error', (err) => {
    logger.error('OpenAI WS error:', err.message);
    if (!closing) {
      closing = true;
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close(1011, 'OpenAI error');
      }
    }
  });

  // Client WS error → log
  clientWs.on('error', (err) => {
    logger.error('Client WS error:', err.message);
  });
}

module.exports = { handleRealtimeProxy };
