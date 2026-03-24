require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const logger = require('./src/utils/logger');

const chatRouter = require('./src/routes/chat');
const leadRouter = require('./src/routes/lead');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/lead', leadRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// HTTP → WS сервер
const server = http.createServer(app);


server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
