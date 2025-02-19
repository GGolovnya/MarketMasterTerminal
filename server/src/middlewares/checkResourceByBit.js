/**
 * Модуль для проверки и получения ресурсов Bybit API
 */

const { checkBybitConnection } = require('../utils/checkConnection');
const logger = require('../configs/logger');
const WebSocket = require('ws');

/**
 * Проверяет доступность Bybit API и возвращает ресурсы
 * @returns {Promise<Object>} Объект с ресурсами и статусом
 */
async function checkBybitResources() {
  try {
    const connectionStatus = await checkBybitConnection();
    
    if (!connectionStatus.status) {
      logger.warn('Bybit API недоступно');
      return {
        status: false,
        resources: [],
        message: 'Ресурсы Bybit API недоступны'
      };
    }

    // Получаем информацию о торговых парах
    const symbolInfo = await fetch('https://api.bybit.com/v5/market/instruments-info?category=spot');
    const symbolData = await symbolInfo.json();

    // Получаем тикеры
    const tickerInfo = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
    const tickerData = await tickerInfo.json();

    // Получаем книги ордеров
    const orderBookInfo = await Promise.all(
      symbolData.result.list
        .slice(0, 10) // Ограничиваем количество запросов
        .map(symbol =>
          fetch(`https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${symbol.symbol}&limit=5`)
            .then(res => res.json())
            .catch(err => {
              logger.error(`Ошибка получения книги ордеров для ${symbol.symbol}: ${err.message}`);
              return null;
            })
        )
    );

    // Формируем массив ресурсов
    const resources = symbolData.result.list.map(symbol => {
      const ticker = tickerData.result.list.find(t => t.symbol === symbol.symbol);
      const orderBook = orderBookInfo.find(ob => ob?.result?.symbol === symbol.symbol);

      return {
        symbol: symbol.symbol,
        baseAsset: symbol.baseCoin,
        quoteAsset: symbol.quoteCoin,
        status: symbol.status,
        price: {
          last: ticker?.lastPrice || null,
          change: ticker?.price24hPcnt || null,
          high24h: ticker?.highPrice24h || null,
          low24h: ticker?.lowPrice24h || null
        },
        volume: {
          base: ticker?.volume24h || null,
          quote: ticker?.turnover24h || null
        },
        orderBook: orderBook?.result ? {
          bids: orderBook.result.bids.slice(0, 5),
          asks: orderBook.result.asks.slice(0, 5),
          timestamp: orderBook.result.ts
        } : null,
        limits: {
          minOrderQty: symbol.minOrderQty,
          maxOrderQty: symbol.maxOrderQty,
          minOrderAmt: symbol.minOrderAmt,
          maxOrderAmt: symbol.maxOrderAmt,
          tickSize: symbol.tickSize,
          lotSize: symbol.lotSize
        }
      };
    });

    return {
      status: true,
      resources,
      message: 'Ресурсы Bybit API доступны',
      timestamp: Date.now()
    };

  } catch (error) {
    logger.error(`Ошибка при проверке ресурсов Bybit API: ${error.message}`);
    return {
      status: false,
      resources: [],
      message: 'Ошибка при получении ресурсов Bybit API',
      error: error.message
    };
  }
}

module.exports = checkBybitResources;