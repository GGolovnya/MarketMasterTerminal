const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Преобразование SequelizeValidationError в ValidationError
    if (err.name === 'SequelizeValidationError') {
      err.name = 'ValidationError';
    }
  
    // Обработка ошибок "не найдено"
    if (err.name === 'NotFoundError') {
      return res.status(404).json({
        status: 'error',
        type: 'not_found',
        message: 'Запрашиваемый ресурс не найден в базе данных'
      });
    }
    
    // Обработка ошибок валидации
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        type: 'validation',
        message: 'Данные не соответствуют заданным правилам или ограничениям в базе данных',
        details: err.errors || err.message
      });
    }
  
    // Обработка ошибок аутентификации
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        type: 'auth',
        message: 'Срок действия токена истек'
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        type: 'auth',
        message: 'Недействительный токен'
      });
    }
  
    // Обработка ошибок уникальности (SequelizeUniqueConstraintError)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        type: 'unique_constraint',
        message: 'Запись с такими данными уже существует',
        details: err.errors?.map(e => e.message)
      });
    }
  
    // Обработка ошибок внешнего ключа (SequelizeForeignKeyConstraintError)
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        status: 'error',
        type: 'foreign_key',
        message: 'Невозможно выполнить операцию из-за связанных данных',
        details: err.message
      });
    }
  
    // Обработка серверных ошибок
    res.status(500).json({
      status: 'error',
      type: 'server',
      message: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  module.exports = errorHandler;