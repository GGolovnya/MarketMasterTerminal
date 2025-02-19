require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
// const setupWebSocketServer = require('./websocket/serverBinance');
// const setupBybitWebSocketServer = require('./websocket/serverByBit');
const apiRouter = require('./routers/api.router');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./configs/logger');

const app = express();
const server = http.createServer(app);
const { PORT } = process.env;
const { CORS_CONFIG } = process.env;

const corsConfig = {
  origin: CORS_CONFIG,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRouter);
app.use(errorHandler);

function startServer() {
  try {
    server.listen(PORT, () => {
      logger.info(`HTTP сервер запущен на порту ${PORT}`);
      
      // // Инициализация WebSocket серверов
      // setupWebSocketServer(server);
      // setupBybitWebSocketServer(server);
      
      // logger.info('WebSocket серверы инициализированы');
    });

    // Обработка закрытия приложения
    process.on('SIGTERM', () => {
      logger.info('Получен сигнал SIGTERM, закрываем сервер...');
      server.close(() => {
        logger.info('Сервер успешно закрыт');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
}

// Запускаем сервер
startServer();