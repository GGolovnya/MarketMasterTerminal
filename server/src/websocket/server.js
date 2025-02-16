const WebSocket = require('ws');
const Binance = require('node-binance-api');

const CACHE_LIFETIME = 60000; // 1 minute cache
const UPDATE_INTERVAL = 10000; // 10 seconds update interval

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  timeout: 120000,
  recvWindow: 120000,
  reconnect: true,
  useServerTime: true
});

let balanceCache = null;
let lastUpdate = 0;
let binanceStream = null;

async function getBalances() {
  try {
    const now = Date.now();
    if (balanceCache && (now - lastUpdate < CACHE_LIFETIME)) {
      return balanceCache;
    }

    const [balance, prices] = await Promise.all([
      binance.balance(),
      binance.prices()
    ]);
    
    let balances = [];
    let totalBalance = 0;

    for (const [symbol, amount] of Object.entries(balance)) {
      if (amount.available > 0) {
        let usdValue = 0;
        
        if (symbol === 'USDT') {
          usdValue = parseFloat(amount.available);
        } else {
          const usdtPair = `${symbol}USDT`;
          if (prices[usdtPair]) {
            usdValue = parseFloat(amount.available) * parseFloat(prices[usdtPair]);
          }
        }

        if (usdValue >= 1) {
          balances.push({
            symbol,
            amount: parseFloat(amount.available),
            usdValue
          });
          totalBalance += usdValue;
        }
      }
    }

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

function setupBinanceStream() {
  if (binanceStream) {
    binanceStream.close();
  }

  binanceStream = binance.websockets.userData(
    (balance) => {
      // Handle balance update
      getBalances().catch(console.error);
    },
    (executionData) => {
      // Handle order execution
      getBalances().catch(console.error);
    }
  );
}

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws/balance' });

  wss.on('connection', async (ws) => {
    try {
      // Send initial balance
      const initialBalance = await getBalances();
      ws.send(JSON.stringify(initialBalance));

      // Setup Binance stream if not already running
      if (!binanceStream) {
        setupBinanceStream();
      }

      // Handle ping messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Periodic balance updates
      const updateInterval = setInterval(async () => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            const balance = await getBalances();
            ws.send(JSON.stringify(balance));
          } catch (error) {
            console.error('Error sending balance update:', error);
          }
        }
      }, UPDATE_INTERVAL);

      ws.on('close', () => {
        clearInterval(updateInterval);
      });

    } catch (error) {
      console.error('Error in WebSocket connection:', error);
      ws.close();
    }
  });

  return wss;
}

module.exports = setupWebSocketServer;