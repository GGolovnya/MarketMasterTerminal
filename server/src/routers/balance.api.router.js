// routes/balance.api.router.js
const router = require('express').Router();
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET
});

router.get('/', async (req, res) => { // Изменено с '/balance' на '/'
  console.log('Получен запрос на получение баланса');
  try {
    console.log('Попытка подключения к Binance API...');
    const balance = await binance.balance();
    const usdtBalance = balance.USDT.available;
    res.json({ balance: usdtBalance });
  } catch (error) {
    console.error('Детали ошибки:', error);
    res.status(500).json({ message: 'Ошибка получения баланса' });
  }
});

module.exports = router;