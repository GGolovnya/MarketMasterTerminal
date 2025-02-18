const WebSocket = require('ws');
const { Spot } = require('@binance/connector');

const CACHE_LIFETIME = 60000; // 1 минута кеширования
const UPDATE_INTERVAL = 10000; // 10 секунд интервал обновления
let listenKeyInterval;
let balanceCache = null;
let lastUpdate = 0;
let userSocket = null;

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
    console.error('Ошибка получения балансов:', error);
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
    const listenKey = await client.createListenKey();
    
    // Обновление listenKey каждые 30 минут
    listenKeyInterval = setInterval(async () => {
      try {
        await client.renewListenKey(listenKey.data.listenKey);
      } catch (error) {
        console.error('Ошибка обновления listenKey:', error);
      }
    }, 30 * 60 * 1000);

    userSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${listenKey.data.listenKey}`);
    
    userSocket.on('message', async (data) => {
      const payload = JSON.parse(data);
      if (payload.e === 'outboundAccountPosition' || payload.e === 'executionReport') {
        await getBalances();
      }
    });

    userSocket.on('error', (error) => {
      console.error('Ошибка WebSocket соединения:', error);
      setTimeout(setupUserStream, 5000);
    });

    userSocket.on('close', () => {
      console.log('WebSocket соединение закрыто, переподключение...');
      setTimeout(setupUserStream, 5000);
    });

  } catch (error) {
    console.error('Ошибка установки user stream:', error);
    setTimeout(setupUserStream, 5000);
  }
}

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws/binance/balance' });

  // Инициализация user stream при запуске сервера
  setupUserStream();

  wss.on('connection', async (ws) => {
    try {
      const initialBalance = await getBalances();
      ws.send(JSON.stringify(initialBalance));

      // Обработка ping сообщений
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          console.error('Ошибка обработки сообщения:', error);
        }
      });

      ws.on('close', () => {
        // Очистка не требуется, так как user stream общий для всех клиентов
      });

    } catch (error) {
      console.error('Ошибка в WebSocket соединении:', error);
      ws.close();
    }
  });

  return wss;
}

module.exports = setupWebSocketServer;