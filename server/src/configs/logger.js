const winston = require('winston'); // Импортируем библиотеку winston для логирования

// Создаем конфигурацию логгера
const logger = winston.createLogger({
  level: 'info', // Устанавливаем базовый уровень логирования
  format: winston.format.combine( // Комбинируем форматы логов
    winston.format.timestamp(), // Добавляем временную метку
    winston.format.json() // Форматируем логи в JSON
  ),
  transports: [ // Настраиваем куда будут записываться логи
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Файл для ошибок
    new winston.transports.File({ filename: 'combined.log' }) // Файл для всех логов
  ]
});

// Добавляем вывод в консоль для разработки
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // Добавляем цвета в консоль
      winston.format.simple() // Используем простой формат для консоли
    )
  }));
}

module.exports = logger; // Экспортируем настроенный логгер