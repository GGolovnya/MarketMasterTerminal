/**
 * Модуль для проверки и получения ресурсов Binance API
 */

const { checkBinanceConnection } = require('../utils/checkConnection');
const logger = require('../configs/logger');
const WebSocket = require('ws');

/**
 * Проверяет доступность Binance API и возвращает ресурсы
 * @returns {Promise<Object>} Объект с ресурсами и статусом
 */
async function checkBinanceResources() {
  try {
    const connectionStatus = await checkBinanceConnection();
    
    if (!connectionStatus.status) {
      logger.warn('Binance API недоступно');
      return {
        status: false,
        resources: [],
        message: 'Ресурсы Binance API недоступны'
      };
    }

    // Получаем информацию о торговых парах
    const spotInfo = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    const spotData = await spotInfo.json();

    // Получаем текущие цены
    const tickerInfo = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const tickerData = await tickerInfo.json();

    // Получаем глубину рынка
    const depthInfo = await Promise.all(
      spotData.symbols
        .filter(symbol => symbol.status === 'TRADING')
        .slice(0, 10) // Ограничиваем количество запросов
        .map(symbol => 
          fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.symbol}&limit=5`)
            .then(res => res.json())
            .catch(err => {
              logger.error(`Ошибка получения глубины рынка для ${symbol.symbol}: ${err.message}`);
              return null;
            })
        )
    );

    // Формируем массив ресурсов
    const resources = spotData.symbols
      .filter(symbol => symbol.status === 'TRADING')
      .map(symbol => {
        const ticker = tickerData.find(t => t.symbol === symbol.symbol);
        const depth = depthInfo.find(d => d?.lastUpdateId && d.symbol === symbol.symbol);
        
        return {
          symbol: symbol.symbol,
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          price: {
            last: ticker?.lastPrice || null,
            change: ticker?.priceChange || null,
            changePercent: ticker?.priceChangePercent || null
          },
          volume: {
            base: ticker?.volume || null,
            quote: ticker?.quoteVolume || null
          },
          orderBook: depth ? {
            bids: depth.bids.slice(0, 5),
            asks: depth.asks.slice(0, 5)
          } : null,
          limits: {
            minQty: symbol.filters.find(f => f.filterType === 'LOT_SIZE')?.minQty,
            maxQty: symbol.filters.find(f => f.filterType === 'LOT_SIZE')?.maxQty,
            stepSize: symbol.filters.find(f => f.filterType === 'LOT_SIZE')?.stepSize
          }
        };
      });

    return {
      status: true,
      resources,
      message: 'Ресурсы Binance API доступны',
      timestamp: Date.now()
    };

  } catch (error) {
    logger.error(`Ошибка при проверке ресурсов Binance API: ${error.message}`);
    return {
      status: false,
      resources: [],
      message: 'Ошибка при получении ресурсов Binance API',
      error: error.message
    };
  }
}

module.exports = checkBinanceResources;