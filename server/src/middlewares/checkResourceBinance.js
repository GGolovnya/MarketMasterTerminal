/**
 * Модуль для проверки и получения ресурсов Binance API
 */

const { checkBinanceConnection } = require('../utils/checkConnection');
const logger = require('../configs/logger');

/**
 * Проверяет доступность Binance API и возвращает ресурсы или пустой массив
 * @returns {Promise<Object>} Объект с ресурсами или пустой массив
 */
async function checkBinanceResources() {
  try {
    const connectionStatus = await checkBinanceConnection();
    
    if (!connectionStatus.status) {
      logger.warn('Binance API недоступно, возвращаем пустой массив ресурсов');
      return {
        status: false,
        resources: [],
        message: 'Ресурсы Binance API недоступны'
      };
    }

    // Здесь можно добавить логику получения реальных ресурсов
    return {
      status: true,
      resources: [], // Заполнить реальными данными при необходимости
      message: 'Ресурсы Binance API доступны'
    };

  } catch (error) {
    logger.error(`Ошибка при проверке ресурсов Binance API: ${error.message}`);
    return {
      status: false,
      resources: [],
      message: 'Ошибка при получении ресурсов Binance API'
    };
  }
}

module.exports = checkBinanceResources;