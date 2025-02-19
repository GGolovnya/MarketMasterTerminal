const winston = require('winston');

// Создаем конфигурацию логгера
const logger = winston.createLogger({
  level: 'info', // Устанавливаем базовый уровень логирования
  format: winston.format.combine( // Комбинируем форматы логов
    winston.format.timestamp(), // Добавляем временную метку
    winston.format.json() // Форматируем логи в JSON
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Файл для ошибок
    new winston.transports.File({ filename: 'combined.log' }) // Файл для всех логов
  ]
});

module.exports = logger;