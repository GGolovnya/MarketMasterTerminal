const router = require("express").Router();
const { Spot } = require('@binance/connector');
const logger = require('../configs/logger');
const checkBinanceResources = require('../middlewares/checkResourceBinance');

const client = new Spot(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_API_SECRET,
  {
    baseURL: 'https://api.binance.com',
    timeout: 60000,
  }
);

router.get('/balance', async (req, res, next) => {
  try {
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      const error = new Error('API ключи Binance не настроены');
      error.name = 'ValidationError';
      throw error;
    }

    const resourceStatus = await checkBinanceResources();
    if (!resourceStatus.status) {
      logger.error('Ошибка доступа к Binance API');
      return res.status(503).json({
        status: 'error',
        message: resourceStatus.message
      });
    }

    const [accountInfo, tickerPrices] = await Promise.all([
      client.account(),
      client.tickerPrice()
    ]);
    
    if (!accountInfo.data || !tickerPrices.data) {
      const error = new Error('Не удалось получить данные от Binance API');
      error.name = 'ServerError';
      throw error;
    }

    let binanceBalances = [];
    let totalBinanceBalance = 0;

    const prices = tickerPrices.data.reduce((acc, item) => {
      acc[item.symbol] = item.price;
      return acc;
    }, {});

    for (const balance of accountInfo.data.balances) {
      const availableAmount = parseFloat(balance.free);
      if (!isNaN(availableAmount) && availableAmount > 0) {
        let usdValue = 0;
        
        if (balance.asset === 'USDT') {
          usdValue = availableAmount;
        } else {
          const usdtPair = `${balance.asset}USDT`;
          const price = parseFloat(prices[usdtPair]);
          if (!isNaN(price)) {
            usdValue = availableAmount * price;
          }
        }

        if (usdValue >= 1) {
          binanceBalances.push({
            exchange: 'Binance',
            symbol: balance.asset,
            amount: parseFloat(availableAmount.toFixed(8)),
            usdValue: parseFloat(usdValue.toFixed(2))
          });
          totalBinanceBalance += usdValue;
        }
      }
    }

    binanceBalances.sort((a, b) => b.usdValue - a.usdValue);
    logger.info('Успешно получены балансы Binance');
    
    res.json({ 
      binanceBalances, 
      totalBinanceBalance: parseFloat(totalBinanceBalance.toFixed(2)) 
    });
  } catch (error) {
    logger.error(`Ошибка при получении баланса Binance: ${error.message}`);
    next(error);
  }
});

router.get('/open-orders', async (req, res, next) => {
  try {
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      const error = new Error('API ключи Binance не настроены');
      error.name = 'ValidationError';
      throw error;
    }

    const resourceStatus = await checkBinanceResources();
    if (!resourceStatus.status) {
      logger.error('Ошибка доступа к Binance API');
      return res.status(503).json({
        status: 'error',
        message: resourceStatus.message
      });
    }

    const openOrders = await client.openOrders();
    
    if (!openOrders.data) {
      const error = new Error('Не удалось получить данные ордеров от Binance API');
      error.name = 'ServerError';
      throw error;
    }

    logger.info('Успешно получены открытые ордера Binance');
    res.json({
      orders: openOrders.data
    });
  } catch (error) {
    logger.error(`Ошибка при получении открытых ордеров Binance: ${error.message}`);
    next(error);
  }
});

module.exports = router;