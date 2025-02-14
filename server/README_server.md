# Серверная часть проекта

## Обзор технологий
- Node.js - запуск JavaScript на сервере (`npm install nodejs`)
- Express - фреймворк для веб-приложений (`npm install express`)
- PostgreSQL - база данных (`sudo apt install postgresql`)
- Sequelize ORM - работа с БД (`npm install sequelize`)
- JWT - аутентификация пользователей (`npm install jsonwebtoken`)
- Morgan - логирование запросов (`npm install morgan`)
- CORS - безопасность межсайтовых запросов (`npm install cors`)
- Cookie-parser - работа с куками (`npm install cookie-parser`)
- Bcrypt - хеширование паролей (`npm install bcrypt`)
- Axios - HTTP-клиент для запросов (`npm install axios`)
- Dotenv - работа с переменными окружения (`npm install dotenv`)
- pg и pg-hstore - драйверы PostgreSQL (`npm install pg pg-hstore`)

## Команды в терминале

### Общие команды
- `npm i` - установка зависимостей
- `npm run dev` - запуск сервера с nodemon
- `npm run test` - запуск тестов

### Команды Sequelize ORM
- `npx sequelize-cli db:migrate` - запустить миграции
- `npx sequelize-cli db:seed:all` - заполнение тестовыми данными
- `npm run db:reset` - полный сброс базы данных
- `npm run db:remigrate` - обновление структуры БД