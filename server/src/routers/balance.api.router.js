const router = require('express').Router();
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  timeout: 60000,
  recvWindow: 60000,
  reconnect: true
});

router.get('/', async (req, res) => {
  try {
    const balance = await binance.balance();
    const prices = await binance.prices();
    
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
    res.json({ balances, totalBalance });
  } catch (error) {
    console.error('Детали ошибки:', error);
    res.status(500).json({ message: 'Ошибка получения баланса' });
  }
});

module.exports = router;