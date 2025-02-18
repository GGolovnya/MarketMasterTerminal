/**
 * Модуль для проверки соединения с различными API
 * Используется для мониторинга доступности API и обработки ошибок соединения
 */

const fetch = require('node-fetch');
const logger = require('../configs/logger');

/**
 * Проверяет соединение с указанным API
 * @param {string} apiType - Тип API (binance, bybit)
 * @param {string} baseUrl - Базовый URL API
 * @returns {Promise<Object>} Объект с информацией о статусе соединения
 */
async function checkApiConnection(apiType, baseUrl) {
  const endpoints = {
    binance: '/api/v3/ping',
    bybit: '/v5/market/time'
  };

  try {
    const endpoint = endpoints[apiType] || '';
    const response = await fetch(`${baseUrl}${endpoint}`, {
      timeout: 5000
    });

    if (!response.ok) {
      const errorMessage = `${apiType.toUpperCase()} API недоступно. Код ошибки: ${response.status}`;
      logger.error(errorMessage);
      return {
        status: false,
        error: errorMessage
      };
    }

    logger.info(`Соединение с ${apiType.toUpperCase()} API работает`);
    return {
      status: true,
      message: `${apiType.toUpperCase()} API доступно`
    };

  } catch (error) {
    let errorMessage = 'Неизвестная ошибка';

    if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
      errorMessage = `Таймаут подключения к ${apiType.toUpperCase()} API`;
    } 
    else if (error.code === 'ECONNREFUSED') {
      errorMessage = `${apiType.toUpperCase()} API не существует или недоступно`;
    }
    else if (error.message.includes('getaddrinfo')) {
      errorMessage = `${apiType.toUpperCase()} API не найдено. Проверьте URL или доступность сервиса`;
    }
    else {
      errorMessage = `Ошибка подключения к ${apiType.toUpperCase()} API: ${error.message}`;
    }

    logger.error(errorMessage);
    return {
      status: false,
      error: errorMessage
    };
  }
}

// Функции для конкретных API
const checkBinanceConnection = () => checkApiConnection('binance', 'https://api.binance.com');
const checkBybitConnection = () => checkApiConnection('bybit', 'https://api.bybit.com');

module.exports = {
  checkBinanceConnection,
  checkBybitConnection,
  checkApiConnection
};