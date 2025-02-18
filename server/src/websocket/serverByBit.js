const WebSocket = require('ws');
const crypto = require('crypto');
const logger = require('../configs/logger');

// Конфигурация API Bybit
const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;
const WS_BASE_URL = 'wss://stream.bybit.com/v5/private';

// Функция для создания подписи
const generateSignature = (expires) => {
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(expires + API_KEY)
    .digest('hex');
};

// Настройка WebSocket сервера для Bybit
async function setupBybitWebSocketServer(server) {
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws/bybit/balance'
  });

  let bybitWs;
  let pingInterval;

  // Подключение к Bybit WebSocket
  const connectToBybit = async () => {
    try {
      const expires = Date.now() + 10000;
      const signature = generateSignature(expires.toString());
      
      bybitWs = new WebSocket(WS_BASE_URL);
      
      bybitWs.on('open', () => {
        logger.info('Соединение с Bybit WebSocket установлено');
        
        // Аутентификация
        const authMessage = {
          op: 'auth',
          args: [API_KEY, expires.toString(), signature]
        };
        
        bybitWs.send(JSON.stringify(authMessage));
        
        // Подписка на обновления баланса и ордеров
        const subscribeMessage = {
          op: 'subscribe',
          args: ['wallet', 'order']
        };
        
        bybitWs.send(JSON.stringify(subscribeMessage));
        
        // Отправка ping каждые 20 секунд
        pingInterval = setInterval(() => {
          bybitWs.send(JSON.stringify({ op: 'ping' }));
        }, 20000);
      });

      bybitWs.on('message', (data) => {
        try {
          const payload = JSON.parse(data.toString());
          
          // Обработка pong-ответа
          if (payload.op === 'pong') {
            return;
          }
          
          // Обработка подтверждения аутентификации
          if (payload.op === 'auth' && payload.success) {
            logger.info('Успешная аутентификация в Bybit WebSocket');
            return;
          }
          
          // Отправка обновлений всем подключенным клиентам
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(payload));
            }
          });
        } catch (error) {
          logger.error('Ошибка обработки сообщения Bybit:', error);
        }
      });

      bybitWs.on('error', (error) => {
        logger.error('Ошибка WebSocket Bybit:', error);
        clearInterval(pingInterval);
        setTimeout(connectToBybit, 5000);
      });

      bybitWs.on('close', () => {
        logger.info('Соединение с Bybit закрыто, переподключение...');
        clearInterval(pingInterval);
        setTimeout(connectToBybit, 5000);
      });
      
    } catch (error) {
      logger.error('Ошибка подключения к Bybit:', error);
      setTimeout(connectToBybit, 5000);
    }
  };

  // Начальное подключение
  await connectToBybit();

  // Обработка подключений клиентов
  wss.on('connection', (ws) => {
    logger.info('Клиент подключен к Bybit WebSocket');

    ws.on('close', () => {
      logger.info('Клиент отключен от Bybit WebSocket');
    });

    ws.on('error', (error) => {
      logger.error('Ошибка клиентского соединения Bybit:', error);
    });
  });

  // Очистка при завершении работы сервера
  process.on('SIGINT', () => {
    clearInterval(pingInterval);
    if (bybitWs) {
      bybitWs.close();
    }
    process.exit(0);
  });

  return wss;
}

module.exports = setupBybitWebSocketServer;