/**
 * Модуль для проверки соединения с Binance API
 * Используется для мониторинга доступности API и обработки ошибок соединения
 */

const fetch = require('node-fetch');
const logger = require('../configs/logger');

/**
 * Проверяет соединение с Binance API
 * @returns {Promise<Object>} Объект с информацией о статусе соединения
 *   - status: boolean - успешность соединения
 *   - message/error: string - сообщение об успехе или ошибке
 */
async function checkBinanceConnection() {
  try {
    // Отправляем ping-запрос к API Binance
    const response = await fetch('https://api.binance.com/api/v3/ping', {
      timeout: 5000 // 5 секунд таймаут для быстрого определения проблем с соединением
    });

    // Проверяем успешность ответа
    if (!response.ok) {
      const errorMessage = `API недоступно. Код ошибки: ${response.status}`;
      logger.error(errorMessage);
      return {
        status: false,
        error: errorMessage
      };
    }

    // Успешное соединение
    const data = await response.json();
    logger.info('Соединение с Binance API работает');
    return {
      status: true,
      message: 'API доступно'
    };

  } catch (error) {
    // Обработка различных типов ошибок соединения
    let errorMessage = 'Неизвестная ошибка';

    // Таймаут соединения
    if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Таймаут подключения к API';
    } 
    // Сервер недоступен
    else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'API не существует или недоступно';
    }
    // Проблемы с DNS
    else if (error.message.includes('getaddrinfo')) {
      errorMessage = 'API не найдено. Проверьте URL или доступность сервиса';
    }
    // Прочие ошибки
    else {
      errorMessage = `Ошибка подключения к API: ${error.message}`;
    }

    logger.error(errorMessage);
    return {
      status: false,
      error: errorMessage
    };
  }
}

module.exports = checkBinanceConnection;