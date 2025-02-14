# Утилиты

## generateToken.js
Утилита для генерации JWT токенов. 

### Функционал:
- Создает accessToken и refreshToken для аутентификации
- Использует переменные окружения для секретных ключей
- Применяет конфигурацию из jwtConfig для настройки токенов

### Использование:
```js
const generateToken = require('./utils/generateToken');

const payload = { userId: 1, email: 'user@example.com' };
const tokens = generateToken(payload);
// Возвращает { accessToken: '...', refreshToken: '...' }
```

### Параметры:
- payload: объект с данными для включения в токен

### Зависимости:
- jsonwebtoken: для создания JWT токенов
- dotenv: для работы с переменными окружения
- ../configs/jwtConfig: настройки для токенов