const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const errorResponses = {
    ValidationError: {
      status: 400,
      type: 'validation',
      message: 'Данные не соответствуют заданным правилам или ограничениям в базе данных'
    },
    NotFoundError: {
      status: 404,
      type: 'not_found',
      message: 'Запрашиваемый ресурс не найден в базе данных'
    },
    TokenExpiredError: {
      status: 401,
      type: 'auth',
      message: 'Срок действия токена истек'
    },
    JsonWebTokenError: {
      status: 401,
      type: 'auth',
      message: 'Недействительный токен'
    },
    AuthHeaderError: {
      status: 401,
      type: 'auth',
      message: 'Неверный заголовок авторизации'
    },
    MissingTokenError: {
      status: 401,
      type: 'auth', 
      message: 'Отсутствует токен'
    },
    AdminAccessError: {
      status: 403,
      type: 'auth',
      message: 'Требуются права администратора'
    },
    SequelizeUniqueConstraintError: {
      status: 409,
      type: 'unique_constraint',
      message: 'Запись с такими данными уже существует'
    },
    SequelizeForeignKeyConstraintError: {
      status: 409,
      type: 'foreign_key',
      message: 'Невозможно выполнить операцию из-за связанных данных'
    },
    ServerError: {
      status: 500,
      type: 'server',
      message: 'Внутренняя ошибка сервера'
    }
  };

  // Преобразование SequelizeValidationError в ValidationError
  if (err.name === 'SequelizeValidationError') {
    err.name = 'ValidationError';
  }

  const errorType = errorResponses[err.name] || errorResponses.ServerError;
  const response = {
    status: 'error',
    type: errorType.type,
    message: errorType.message
  };

  // Добавляем детали только для определенных типов ошибок
  if (err.name === 'ValidationError') {
    response.details = err.errors || err.message;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    response.details = err.errors?.map(e => e.message);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    response.details = err.message;
  } else if (err.name === 'ServerError' && process.env.NODE_ENV === 'development') {
    response.details = err.message;
  }

  res.status(errorType.status).json(response);
}

module.exports = errorHandler;