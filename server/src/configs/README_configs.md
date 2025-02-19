# Конфигурационные файлы

Название: cookieConfig.js
Цель: Настройка параметров cookies для JWT токенов.
В каких файлах используется:
- src/routers/auth.api.router.js (для установки cookies при авторизации)
- src/routers/token.api.router.js (для обновления cookies)

Название: jwtConfig.js
Цель: Конфигурация времени жизни JWT токенов.
В каких файлах используется:
- src/configs/cookieConfig.js (для синхронизации времени жизни cookies)
- src/utils/generateToken.js (при создании новых токенов)

Название: logger.js
Цель: Настройка системы логирования с использованием Winston.
Особенности:
- Раздельное логирование ошибок и общей информации
- Добавление временных меток
- JSON формат логов
В каких файлах используется:
- src/middlewares/errorHandler.js (для логирования ошибок)
- src/middlewares/checkResourceBinance.js (для логирования статуса API)
- src/middlewares/checkResourceByBit.js (для логирования статуса API)