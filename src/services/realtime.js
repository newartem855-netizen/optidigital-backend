const WebSocket = require('ws');
const logger = require('../utils/logger');

function handleRealtimeProxy(clientWs) {
  const openaiWs = new WebSocket(
    'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    }
  );

  openaiWs.on('open', () => {
    logger.info('Connected to OpenAI Realtime');

    // Конфигурация сессии — голос, язык, поведение
    openaiWs.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['audio', 'text'],
        instructions: 'Ты AI-менеджер агентства OptiDigital. Отвечай на украинском языке. Будь кратким, дружелюбным, профессиональным.',
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

  // OpenAI → клиент
  openaiWs.on('message', (data) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data);
    }
  });

  // Клиент → OpenAI
  clientWs.on('message', (data) => {
    if (openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(data);
    }
  });

  clientWs.on('close', () => {
    logger.info('Voice client disconnected');
    openaiWs.close();
  });

  openaiWs.on('close', () => {
    logger.info('OpenAI Realtime disconnected');
    if (clientWs.readyState === WebSocket.OPEN) clientWs.close();
  });

  openaiWs.on('error', (err) => {
    logger.error('OpenAI WS error:', err.message);
    if (clientWs.readyState === WebSocket.OPEN) clientWs.close();
  });
}

module.exports = { handleRealtimeProxy };