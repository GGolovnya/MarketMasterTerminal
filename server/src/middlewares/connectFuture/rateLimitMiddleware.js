/**
 * Middleware для ограничения количества запросов (Rate Limiting)
 * 
 * Этот middleware используется для защиты API от чрезмерного количества запросов,
 * что помогает предотвратить DDoS атаки и перегрузку сервера.
 * 
 * Использование:
 * 1. Подключить в основной файл приложения (app.js):
 *    const { apiLimiter, authLimiter } = require('./middlewares/rateLimitMiddleware');
 * 
 * 2. Применить к маршрутам:
 *    app.use('/api', apiLimiter);          // Общее ограничение для API
 *    app.use('/api/auth', authLimiter);    // Строгое ограничение для аутентификации
 * 
 * Принцип работы:
 * 1. Отслеживает количество запросов с каждого IP-адреса
 * 2. Блокирует запросы, превышающие установленный лимит
 * 3. Возвращает статус 429 при превышении лимита
 * 
 * Настройка лимитов:
 * - windowMs: временное окно в миллисекундах
 * - max: максимальное количество запросов в окне
 */

const rateLimit = require('express-rate-limit');

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100 } = {}) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // Limit each IP to max requests per windowMs
    message: {
      status: 'error',
      type: 'rate_limit',
      message: 'Слишком много запросов, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        type: 'rate_limit',
        message: 'Слишком много запросов с этого IP-адреса, попробуйте позже'
      });
    }
  });
};

// Создаем различные лимитеры для разных эндпоинтов
const apiLimiter = createRateLimiter();                                    // Общий лимит: 100 запросов/15 минут
const authLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }); // Строгий лимит: 5 запросов/час

module.exports = {
  apiLimiter,
  authLimiter,
  createRateLimiter
};