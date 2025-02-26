import { ApiKeyService } from '../services/apiKeyService';
import WebSocket from 'ws';
import { logger } from '../utils/logger';
import { bybitGenerateSignature } from '../utils/signatures/bybit/bybitGenerateSignature';
import { checkBybitResources } from '../middlewares/checkResourceByBit';

const WS_BASE_URL = 'wss://stream.bybit.com/v5/private';
const CACHE_LIFETIME = 60000;
const MAX_RECONNECT_DELAY = 300000;

const apiKeyService = new ApiKeyService();
let bybitWs;
let balanceCache = null;
let lastUpdate = 0;
let reconnectAttempts = 0;
let pingInterval;

async function getBalances(userId) {
  try {
    const now = Date.now();
    if (balanceCache && (now - lastUpdate < CACHE_LIFETIME)) {
      return balanceCache;
    }

    const resourceCheck = await checkBybitResources();
    if (!resourceCheck.status) {
      logger.warn('Bybit API недоступно, возвращаем кешированные данные');
      return balanceCache || { type: 'balance', balances: [], totalBalance: 0 };
    }

    balanceCache = {
      type: 'balance',
      balances: [],
      totalBalance: 0
    };
    lastUpdate = now;

    return balanceCache;
  } catch (error) {
    logger.error('Ошибка получения балансов Bybit:', error);
    if (balanceCache) return balanceCache;
    throw error;
  }
}

const setupBybitWebSocketServer = async (server, userId) => {
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws/bybit/balance'
  });

  const connectToBybit = async () => {
    try {
      const resourceCheck = await checkBybitResources();
      if (!resourceCheck.status) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
        reconnectAttempts++;
        logger.warn(`Переподключение через ${delay}ms, попытка ${reconnectAttempts}`);
        setTimeout(connectToBybit, delay);
        return;
      }

      const keys = await apiKeyService.getApiKeys(userId, 'bybit');
      if (!keys) {
        throw new Error('API keys not found');
      }

      const { signature, timestamp } = bybitGenerateSignature(keys.apiKey, keys.apiSecret);
      
      bybitWs = new WebSocket(WS_BASE_URL);
      
      bybitWs.on('open', () => {
        logger.info('Соединение с Bybit WebSocket установлено');
        reconnectAttempts = 0;
        
        const authMessage = {
          op: 'auth',
          args: [keys.apiKey, timestamp.toString(), signature]
        };
        bybitWs.send(JSON.stringify(authMessage));
        
        const subscribeMessage = {
          op: 'subscribe',
          args: ['wallet', 'order']
        };
        bybitWs.send(JSON.stringify(subscribeMessage));
        
        pingInterval = setInterval(() => {
          if (bybitWs.readyState === WebSocket.OPEN) {
            bybitWs.send(JSON.stringify({ op: 'ping' }));
          }
        }, 20000);
      });

      bybitWs.on('message', async (data) => {
        try {
          const payload = JSON.parse(data.toString());
          
          if (payload.op === 'pong') {
            return;
          }
          
          if (payload.op === 'auth' && payload.success) {
            logger.info('Успешная аутентификация в Bybit WebSocket');
            return;
          }

          if (payload.topic === 'wallet' || payload.topic === 'order') {
            const balances = await getBalances(userId);
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(balances));
              }
            });
          }
        } catch (error) {
          logger.error('Ошибка обработки сообщения Bybit:', error);
        }
      });

      bybitWs.on('error', (error) => {
        logger.error('Ошибка WebSocket Bybit:', error);
        clearInterval(pingInterval);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
        reconnectAttempts++;
        setTimeout(() => connectToBybit(), delay);
      });

      bybitWs.on('close', () => {
        logger.info('Соединение с Bybit закрыто, переподключение...');
        clearInterval(pingInterval);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
        reconnectAttempts++;
        setTimeout(() => connectToBybit(), delay);
      });
      
    } catch (error) {
      logger.error('Ошибка подключения к Bybit:', error);
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
      reconnectAttempts++;
      setTimeout(() => connectToBybit(), delay);
    }
  };

  await connectToBybit();

  wss.on('connection', async (ws) => {
    logger.info('Клиент подключен к Bybit WebSocket');

    try {
      const initialBalance = await getBalances(userId);
      ws.send(JSON.stringify(initialBalance));
    } catch (error) {
      logger.error('Ошибка отправки начального баланса:', error);
    }

    ws.on('close', () => {
      logger.info('Клиент отключен от Bybit WebSocket');
    });

    ws.on('error', (error) => {
      logger.error('Ошибка клиентского соединения Bybit:', error);
    });
  });

  process.on('SIGINT', () => {
    clearInterval(pingInterval);
    if (bybitWs) {
      bybitWs.close();
    }
    process.exit(0);
  });

  return wss;
}

export default setupBybitWebSocketServer;