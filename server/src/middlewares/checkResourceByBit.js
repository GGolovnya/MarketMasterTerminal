/**
 * Модуль для проверки и получения ресурсов Bybit API
 */

const { checkBybitConnection } = require('../utils/checkConnection');
const logger = require('../configs/logger');

/**
 * Проверяет доступность Bybit API и возвращает ресурсы или пустой массив
 * @returns {Promise<Object>} Объект с ресурсами или пустой массив
 */
async function checkBybitResources() {
  try {
    const connectionStatus = await checkBybitConnection();
    
    if (!connectionStatus.status) {
      logger.warn('Bybit API недоступно, возвращаем пустой массив ресурсов');
      return {
        status: false,
        resources: [],
        message: 'Ресурсы Bybit API недоступны'
      };
    }

    // Здесь можно добавить логику получения реальных ресурсов
    return {
      status: true,
      resources: [], // Заполнить реальными данными при необходимости
      message: 'Ресурсы Bybit API доступны'
    };

  } catch (error) {
    logger.error(`Ошибка при проверке ресурсов Bybit API: ${error.message}`);
    return {
      status: false,
      resources: [],
      message: 'Ошибка при получении ресурсов Bybit API'
    };
  }
}

module.exports = checkBybitResources;