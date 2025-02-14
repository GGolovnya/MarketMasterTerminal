/**
 * Middleware для кэширования ответов сервера
 * 
 * Этот middleware используется для кэширования GET-запросов в памяти сервера,
 * что позволяет снизить нагрузку на базу данных и ускорить ответы сервера.
 * 
 * Использование:
 * 1. Подключить в основной файл приложения (app.js):
 *    const { cacheMiddleware } = require('./middlewares/cacheMiddleware');
 * 
 * 2. Применить к конкретному маршруту:
 *    app.get('/api/data', cacheMiddleware(300), controller);
 *    где 300 - время жизни кэша в секундах
 * 
 * Принцип работы:
 * 1. При GET-запросе проверяется наличие данных в кэше по URL запроса
 * 2. Если данные есть - возвращаются из кэша
 * 3. Если нет - запрос обрабатывается и ответ сохраняется в кэш
 * 
 * Очистка кэша:
 * - clearCache(key) - удаляет конкретный ключ
 * - clearCache() - очищает весь кэш
 */

const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Пропускаем кэширование для не-GET запросов
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      return res.send(cachedResponse);
    }

    // Перехватываем отправку ответа для сохранения в кэш
    const originalSend = res.send;
    res.send = function(body) {
      cache.set(key, body, duration);
      originalSend.call(this, body);
    };

    next();
  };
};

const clearCache = (key) => {
  if (key) {
    cache.del(key);
  } else {
    cache.flushAll();
  }
};

module.exports = { cacheMiddleware, clearCache };