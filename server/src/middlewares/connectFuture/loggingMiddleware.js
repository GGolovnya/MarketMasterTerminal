/**
 * Middleware для логирования запросов и ответов сервера
 * 
 * Этот middleware используется для отслеживания всех HTTP запросов и ответов,
 * что помогает в отладке и мониторинге работы приложения.
 * 
 * Использование:
 * 1. Подключить в основной файл приложения (app.js):
 *    const loggingMiddleware = require('./middlewares/loggingMiddleware');
 * 
 * 2. Применить глобально или к конкретному маршруту:
 *    app.use(loggingMiddleware);
 *    или
 *    router.use('/api', loggingMiddleware);
 * 
 * Принцип работы:
 * 1. Логирует информацию о входящем запросе (метод, URL, тело, параметры)
 * 2. Измеряет время выполнения запроса
 * 3. Логирует информацию об ответе (статус, время выполнения)
 */

const loggingMiddleware = (req, res, next) => {
    const start = Date.now();
    const { method, url, body, query, params } = req;
  
    // Логируем входящий запрос
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    if (Object.keys(body).length) console.log('Body:', body);
    if (Object.keys(query).length) console.log('Query:', query);
    if (Object.keys(params).length) console.log('Params:', params);
  
    // Перехватываем отправку ответа для логирования
    const oldSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - start;
      console.log(`Response time: ${duration}ms`);
      console.log(`Status: ${res.statusCode}`);
      oldSend.apply(res, arguments);
    };
  
    next();
  };
  
  module.exports = loggingMiddleware;