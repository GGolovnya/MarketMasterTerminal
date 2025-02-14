# API Роутер - Руководство

## 1. Структура проекта

В проекте используется следующая структура:

```
src/
├── app.js              # Основной файл приложения
├── routers/            # Директория с роутерами
│   ├── api.router.js   # Основной роутер API
│   └── *.api.router.js # Отдельные роутеры для каждой сущности
└── middlewares/        # Middleware компоненты
    └── errorHandler.js # Централизованная обработка ошибок
```

Основной файл api.router.js собирает все маршруты:

```javascript
const router = require('express').Router();
const authRouter = require('./auth.api.router');
const tokenRouter = require('./token.api.router');
const animals = require('./animal.api.router');

router.use('/auth', authRouter);
router.use('/token', tokenRouter);
router.use('/animals', animals);
// ... другие маршруты

module.exports = router;
```

## 2. Основные HTTP методы

- GET - получение данных
- POST - создание новых записей 
- PUT - полное обновление записи
- PATCH - частичное обновление записи
- DELETE - удаление записи

## 3. Структура роутера

```javascript
const router = require('express').Router();
const { Model } = require('../../db/models');//пусть к модельке

// Базовая структура роутера
router.get('/', async (req, res, next) => {
  try {
    // Логика обработки запроса
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

## 4. Основные паттерны запросов

### GET - получение данных
```javascript
// Получить все записи
router.get('/', async (req, res) => {
  const items = await Model.findAll();
  res.json(items);
});

// Получить запись по ID
router.get('/:id', async (req, res) => {
  const item = await Model.findByPk(req.params.id);
  res.json(item);
});
```

### POST - создание
```javascript
router.post('/', async (req, res) => {
  const newItem = await Model.create(req.body);
  res.status(201).json(newItem);
});
```

### PUT/PATCH - обновление
```javascript
router.put('/:id', async (req, res) => {
  const item = await Model.findByPk(req.params.id);
  await item.update(req.body);
  res.json(item);
});
```

### DELETE - удаление
```javascript
router.delete('/:id', async (req, res) => {
  await Model.destroy({ where: { id: req.params.id }});
  res.status(204).send();
});
```

## 5. Обработка ошибок

### В роутерах

```javascript
try {
  const item = await Model.findByPk(req.params.id);
  if (!item) {
    const error = new Error('Ресурс не найден');
    error.name = 'NotFoundError';
    throw error;
  }
  res.json(item);
} catch (error) {
  next(error); //используем мидерварку (централизацию ошибок)
}
```

### Централизованная обработка (errorHandler.js)

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      status: 'error',
      type: 'not_found',
      message: 'Запрашиваемый ресурс не найден'
    });
  }
  
  // Другие типы ошибок...
  
  res.status(500).json({
    status: 'error',
    type: 'server',
    message: 'Внутренняя ошибка сервера'
  });
};
```
 

## 6. Типы обрабатываемых ошибок

- NotFoundError (404) - ресурс не найден
- ValidationError (400) - ошибка валидации данных
- TokenExpiredError (401) - истек срок действия токена
- JsonWebTokenError (401) - недействительный токен
- SequelizeUniqueConstraintError (409) - нарушение уникальности
- SequelizeForeignKeyConstraintError (409) - нарушение внешнего ключа

## 7. Настройка приложения (app.js)

```javascript
require('dotenv').config();
const express = require('express');
const apiRouter = require('./routers/api.router');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(errorHandler);
```

## 8. Коды статусов ответов

- 200: OK - успешный запрос
- 201: Created - успешное создание
- 204: No Content - успешное удаление
- 400: Bad Request - ошибка в запросе
- 401: Unauthorized - ошибка аутентификации
- 404: Not Found - ресурс не найден
- 409: Conflict - конфликт данных
- 500: Internal Server Error - ошибка сервера

## 9. Разъяснение основных концепций

### Router в Express.js

`const router = require('express').Router();` выполняет два действия:
1. Импортирует фреймворк Express
2. Создает новый экземпляр маршрутизатора

Преимущества использования Router():
- Группировка маршрутов в модули
- Применение middleware к группам маршрутов
- Модульная структура приложения
- Эффективная загрузка только нужного функционала

### Параметры req и res

#### req (request)
Объект запроса содержит:
- req.params - параметры маршрута (например, :id в URL)
- req.query - параметры строки запроса (например, ?sort=asc)
- req.body - тело запроса (данные формы или JSON)
- req.headers - заголовки запроса
- req.cookies - cookies браузера
- req.method - HTTP метод запроса
- req.path - путь запроса
- req.url - полный URL запроса

Примеры использования req.params:
```javascript
// Простой параметр
app.get('/users/:id', (req, res) => {
  console.log(req.params.id)
});

// Несколько параметров
app.get('/users/:userId/posts/:postId', (req, res) => {
  console.log(req.params.userId, req.params.postId)
});
```

#### res (response)
Объект ответа включает методы:
- res.send() - отправка ответа
- res.json() - отправка JSON
- res.status() - установка HTTP-статуса
- res.redirect() - перенаправление

### Методы Sequelize для запросов

#### Основные методы поиска:
- Model.findAll() - получить все записи
- Model.findByPk(id) - найти запись по первичному ключу
- Model.findOne({ where: условие }) - найти первую подходящую запись
- Model.findOrCreate() - найти запись или создать, если не существует

#### Методы с условиями:
- Model.findAll({ where: { field: value } }) - поиск по условию
- Model.findAll({ order: [['field', 'DESC']] }) - сортировка результатов
- Model.findAll({ limit: 10, offset: 20 }) - пагинация
- Model.findAll({ attributes: ['field1', 'field2'] }) - выбор конкретных полей

#### Агрегационные методы:
- Model.count() - подсчет количества записей
- Model.sum('field') - сумма значений поля
- Model.max('field') - максимальное значение
- Model.min('field') - минимальное значение

#### Методы для связей:
- Model.findAll({ include: RelatedModel }) - загрузка связанных данных
- Model.findAll({ include: [{ model: RelatedModel, where: условие }] }) - загрузка с условиями

Примеры использования:
```javascript
// Поиск с условиями
const users = await User.findAll({
  where: {
    age: {
      [Op.gte]: 18  // больше или равно 18
    }
  }
});

// Поиск с сортировкой и пагинацией
const posts = await Post.findAll({
  order: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0
});

// Поиск со связанными данными
const orders = await Order.findAll({
  include: [{
    model: User,
    attributes: ['name', 'email']
  }]
});
```

### Операторы сравнения (Op)
Sequelize предоставляет специальный объект Op для построения условий в запросах:

```javascript
const { Op } = require('sequelize');

// Примеры использования операторов
const records = await Model.findAll({
  where: {
    field: {
      // Точное сравнение
      [Op.eq]: value,     // = (равно) - поиск точных совпадений (например, status === 'active')
      [Op.ne]: value,     // != (не равно) - исключение определенных значений
      
      // Числовые сравнения
      [Op.gt]: value,     // > (больше) - фильтрация по возрасту, цене, дате
      [Op.lt]: value,     // < (меньше) - ограничение максимального значения
      [Op.gte]: value,    // >= (больше или равно) - включая граничное значение
      [Op.lte]: value,    // <= (меньше или равно) - диапазоны цен, возрастные ограничения
      
      // Текстовый поиск
      [Op.like]: '%value%',    // LIKE - поиск подстроки (регистрозависимый)
      [Op.iLike]: '%value%',   // ILIKE - поиск подстроки без учета регистра
      
      // Работа со списками
      [Op.in]: [1, 2, 3],      // IN - поиск по списку допустимых значений
      [Op.notIn]: [1, 2, 3],   // NOT IN - исключение списка значений
      
      // Диапазоны
      [Op.between]: [1, 10],   // BETWEEN - фильтрация по диапазону (цены, даты)
      [Op.notBetween]: [1, 10] // NOT BETWEEN - исключение диапазона значений
    }
  }
});
```

### Именование маршрутов и файлов
Следуйте REST API конвенциям:

#### Маршруты в api.router.js:
```javascript
// Правильно (множественное число)
router.use('/animals', animalRouter);
router.use('/users', userRouter);

// Менее предпочтительно (единственное число)
router.use('/animal', animalRouter);
router.use('/user', userRouter);
```

#### Именование файлов роутеров:
Рекомендуется использовать единственное число в названиях файлов:
```
✓ animal.api.router.js
✓ user.api.router.js
✓ token.api.router.js

// Не рекомендуется
✗ animals.api.router.js
✗ users.api.router.js
✗ tokens.api.router.js
```

## 10. Полезные ссылки

- Express.js документация - https://expressjs.com
- Sequelize документация - https://sequelize.org
- REST API Best Practices - https://restfulapi.net
```