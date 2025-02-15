// src/websocket/server.js
const WebSocket = require('ws');
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET
});

async function getBalances() {
  try {
    const balance = await binance.balance();
    const prices = await binance.prices();
    
    let balances = [];
    let totalBalance = 0;

    for (const [symbol, amount] of Object.entries(balance)) {
      if (amount.available > 0) {
        let usdValue = 0;
        
        // Расчет стоимости в USD
        if (symbol === 'USDT') {
          usdValue = parseFloat(amount.available);
        } else {
          const usdtPair = `${symbol}USDT`;
          if (prices[usdtPair]) {
            usdValue = parseFloat(amount.available) * parseFloat(prices[usdtPair]);
          }
        }

        if (usdValue >= 1) { // Фильтруем монеты с балансом > 1$
          balances.push({
            symbol,
            amount: parseFloat(amount.available),
            usdValue
          });
          totalBalance += usdValue;
        }
      }
    }

    // Сортируем по убыванию стоимости в USD
    balances.sort((a, b) => b.usdValue - a.usdValue);

    return { balances, totalBalance };
  } catch (error) {
    console.error('Ошибка получения балансов:', error);
    throw error;
  }
}

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws/balance' });

  wss.on('connection', (ws) => {
    const sendBalance = async () => {
      try {
        const balanceData = await getBalances();
        ws.send(JSON.stringify(balanceData));
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Ошибка получения баланса' }));
      }
    };

    sendBalance();
    const interval = setInterval(sendBalance, 10000);

    ws.on('close', () => {
      clearInterval(interval);
    });
  });

  return wss;
}

module.exports = setupWebSocketServer;