/**
 * Middleware для валидации входящих запросов
 * 
 * Этот middleware используется для проверки данных в запросах (body, query, params)
 * на соответствие заданным схемам валидации.
 * 
 * Использование:
 * 1. Подключить в файл роутера:
 *    const { validateRequest } = require('./middlewares/validationMiddleware');
 * 
 * 2. Применить к конкретному маршруту:
 *    router.post('/resource', validateRequest(schema), controller);
 *    где schema содержит правила валидации для body, query и params
 * 
 * Принцип работы:
 * 1. Проверяет тело запроса (req.body) если указана schema.body
 * 2. Проверяет query-параметры (req.query) если указана schema.query
 * 3. Проверяет параметры URL (req.params) если указана schema.params
 * 4. При ошибке валидации генерирует ValidationError с деталями
 */

const validateRequest = (schema) => {
    return (req, res, next) => {
      try {
        // Валидация body
        if (schema.body) {
          const { error } = schema.body.validate(req.body);
          if (error) throw { type: 'body', error };
        }
  
        // Валидация query параметров
        if (schema.query) {
          const { error } = schema.query.validate(req.query);
          if (error) throw { type: 'query', error };
        }
  
        // Валидация URL параметров
        if (schema.params) {
          const { error } = schema.params.validate(req.params);
          if (error) throw { type: 'params', error };
        }
  
        next();
      } catch (err) {
        const errorMessages = {
          body: 'Ошибка валидации тела запроса',
          query: 'Ошибка валидации параметров запроса',
          params: 'Ошибка валидации URL параметров'
        };
        const error = new Error(`${errorMessages[err.type]}: ${err.error.message}`);
        error.name = 'ValidationError';
        error.details = err.error.details;
        next(error);
      }
    };
  };
  
  module.exports = { validateRequest };