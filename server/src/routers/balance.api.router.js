// Импортируем необходимые модули
const router = require('express').Router();
const Binance = require('node-binance-api');

// Функция для валидации и преобразования параметров запроса
function validateParams(params) {
  try {
    return {
      ...params,
      timestamp: String(params.timestamp),
      recvWindow: String(params.recvWindow)
    };
  } catch (error) {
    console.error('Ошибка валидации параметров:', {
      error: error.message,
      params
    });
    throw error;
  }
}

// Инициализация клиента Binance с настройками
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  timeout: 60000,
  recvWindow: '60000',
  reconnect: true
});

// Маршрут GET для получения баланса
router.get('/', async (req, res) => {
  try {
    const timestamp = Date.now();
    const params = validateParams({
      timestamp: timestamp,
      recvWindow: '60000'
    });

    // Получаем баланс и текущие цены с Binance
    const [balance, prices] = await Promise.all([
      binance.balance(params),
      binance.prices()
    ]);
    
    let balances = [];
    let totalBalance = 0;

    // Обрабатываем данные баланса
    for (const [symbol, amount] of Object.entries(balance)) {
      if (amount?.available) {
        let usdValue = 0;
        const availableAmount = parseFloat(amount.available);
        
        if (!isNaN(availableAmount) && availableAmount > 0) {
          if (symbol === 'USDT') {
            usdValue = availableAmount;
          } else {
            const usdtPair = `${symbol}USDT`;
            const price = parseFloat(prices[usdtPair]);
            if (!isNaN(price)) {
              usdValue = availableAmount * price;
            }
          }

          // Добавляем только балансы >= 1 USD
          if (usdValue >= 1) {
            balances.push({
              symbol,
              amount: parseFloat(availableAmount.toFixed(8)),
              usdValue: parseFloat(usdValue.toFixed(2))
            });
            totalBalance += usdValue;
          }
        }
      }
    }

    // Сортируем балансы по убыванию стоимости
    balances.sort((a, b) => b.usdValue - a.usdValue);
    res.json({ 
      balances, 
      totalBalance: parseFloat(totalBalance.toFixed(2)) 
    });
  } catch (error) {
    console.error('Детали ошибки:', error);
    res.status(500).json({ message: 'Ошибка получения баланса' });
  }
});

module.exports = router;