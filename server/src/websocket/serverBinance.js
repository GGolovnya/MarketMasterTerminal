const WebSocket = require('ws');
const { Spot } = require('@binance/connector');
const logger = require('../configs/logger');
const checkBinanceResources = require('../middlewares/checkResourceBinance');

const CACHE_LIFETIME = 60000;
const MAX_RECONNECT_DELAY = 300000;
let listenKeyInterval;
let balanceCache = null;
let lastUpdate = 0;
let userSocket = null;
let reconnectAttempts = 0;

const client = new Spot(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET,
  {
    timeout: 120000,
    reconnect: true
  }
);

async function getBalances() {
  try {
    const now = Date.now();
    if (balanceCache && (now - lastUpdate < CACHE_LIFETIME)) {
      return balanceCache;
    }

    const resourceCheck = await checkBinanceResources();
    if (!resourceCheck.status) {
      logger.warn('Binance API недоступно, возвращаем кешированные данные');
      return balanceCache || { type: 'balance', balances: [], totalBalance: 0 };
    }

    const [accountInfo, prices] = await Promise.all([
      client.account(),
      client.tickerPrice()
    ]);
    
    let balances = [];
    let totalBalance = 0;

    accountInfo.data.balances.forEach(asset => {
      const available = parseFloat(asset.free);
      if (available > 0) {
        let usdValue = 0;
        
        if (asset.asset === 'USDT') {
          usdValue = available;
        } else {
          const pair = prices.data.find(p => p.symbol === `${asset.asset}USDT`);
          if (pair) {
            usdValue = available * parseFloat(pair.price);
          }
        }

        if (usdValue >= 1) {
          balances.push({
            symbol: asset.asset,
            amount: available,
            usdValue
          });
          totalBalance += usdValue;
        }
      }
    });

    balances.sort((a, b) => b.usdValue - a.usdValue);
    balanceCache = { type: 'balance', balances, totalBalance };
    lastUpdate = now;
    
    return balanceCache;
  } catch (error) {
    logger.error('Ошибка получения балансов:', error);
    if (balanceCache) return balanceCache;
    throw error;
  }
}

async function setupUserStream() {
  if (userSocket) {
    userSocket.close();
    clearInterval(listenKeyInterval);
  }

  try {
    const resourceCheck = await checkBinanceResources();
    if (!resourceCheck.status) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
      reconnectAttempts++;
      logger.warn(`Переподключение через ${delay}ms, попытка ${reconnectAttempts}`);
      setTimeout(setupUserStream, delay);
      return;
    }

    const listenKey = await client.createListenKey();
    reconnectAttempts = 0;
    
    listenKeyInterval = setInterval(async () => {
      try {
        await client.renewListenKey(listenKey.data.listenKey);
      } catch (error) {
        logger.error('Ошибка обновления listenKey:', error);
      }
    }, 30 * 60 * 1000);

    userSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${listenKey.data.listenKey}`);
    
    userSocket.on('message', async (data) => {
      try {
        const payload = JSON.parse(data);
        if (payload.e === 'outboundAccountPosition' || payload.e === 'executionReport') {
          await getBalances();
        }
      } catch (error) {
        logger.error('Ошибка обработки сообщения:', error);
      }
    });

    userSocket.on('error', (error) => {
      logger.error('Ошибка WebSocket соединения:', error);
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
      reconnectAttempts++;
      setTimeout(setupUserStream, delay);
    });

    userSocket.on('close', () => {
      logger.info('WebSocket соединение закрыто, переподключение...');
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
      reconnectAttempts++;
      setTimeout(setupUserStream, delay);
    });

  } catch (error) {
    logger.error('Ошибка установки user stream:', error);
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
    reconnectAttempts++;
    setTimeout(setupUserStream, delay);
  }
}

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws/binance/balance' });

  setupUserStream();

  wss.on('connection', async (ws) => {
    try {
      const initialBalance = await getBalances();
      ws.send(JSON.stringify(initialBalance));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          logger.error('Ошибка обработки сообщения:', error);
        }
      });

      ws.on('close', () => {
        logger.info('Клиент отключен');
      });

    } catch (error) {
      logger.error('Ошибка в WebSocket соединении:', error);
      ws.close();
    }
  });

  return wss;
}

module.exports = setupWebSocketServer;