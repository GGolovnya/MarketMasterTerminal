# Типы данных SQL

## Числовые типы

### INTEGER
- Диапазон: -2,147,483,648 до 2,147,483,647
- Использование: целые числа
- Пример: `42`, `-17`, `1000`

### SMALLINT
- Диапазон: -32,768 до 32,767
- Использование: малые целые числа
- Пример: `1000`, `-1000`

### DECIMAL/NUMERIC(p,s)
- p: общее число цифр
- s: число цифр после запятой
- Использование: точные десятичные числа
- Пример: `DECIMAL(10,2)` → `1234567.89`

### FLOAT/REAL
- Использование: числа с плавающей точкой
- Пример: `123.456`, `-0.00789`

## Строковые типы

### CHAR(n)
- n: фиксированное число символов
- Дополняется пробелами
- Пример: `CHAR(10)` → `"Hello     "`

### VARCHAR(n)
- n: максимум символов
- Пример: `VARCHAR(255)` → `"Hello"`

### TEXT
- Неограниченная длина
- Пример: большие текстовые блоки

## Временные типы

### DATE
- Формат: `YYYY-MM-DD`
- Пример: `'2024-01-19'`

### TIME
- Формат: `HH:MM:SS`
- Пример: `'14:30:00'`

### TIMESTAMP
- Формат: `YYYY-MM-DD HH:MM:SS`
- Пример: `'2024-01-19 14:30:00'`

## Специальные типы

### BOOLEAN
- Значения: `TRUE`, `FALSE`, `NULL`

### JSON
- Структурированные данные
- Пример: `{"name": "John", "age": 30}`

### ARRAY
- Массивы любых типов
- Пример: `ARRAY['red', 'green', 'blue']`

### ENUM
- Фиксированный список значений
- Пример: `ENUM('small', 'medium', 'large')`

## Документация по Таблице DataTypesExample

### 1. Описание Полей

**textField (STRING)**
- Поле для хранения текстовых данных
- Пример: 'Простой текст', 'Описание товара'

**numberField (INTEGER)**
- Целочисленное поле
- Пример: 42, 100, -5

**decimalField (DECIMAL)**
- Поле для дробных чисел с точностью до 2 знаков
- Пример: 123.45, 999.99

**booleanField (BOOLEAN)**
- Логическое поле
- Значения: true/false

**dateField (DATE)**
- Поле для хранения даты и времени
- Пример: new Date(), new Date('2024-12-31')

**jsonField (JSON)**
- Поле для хранения JSON-структур
- Пример: { key1: 'value1', nested: { innerKey: 'value' } }

**arrayField (ARRAY)**
- Массив строковых значений
- Пример: ['элемент1', 'элемент2']

**enumField (ENUM)**
- Поле с предопределенными значениями
- Допустимые значения: 'option1', 'option2', 'option3'

### 2. Использование в Коде

```javascript
// Создание новой записи
const example = await DataTypesExample.create({
  textField: 'Тестовый текст',
  numberField: 42,
  decimalField: 123.45,
  booleanField: true,
  dateField: new Date(),
  jsonField: { key: 'value' },
  arrayField: ['тест1', 'тест2'],
  enumField: 'option1'
});

// Поиск записей
const records = await DataTypesExample.findAll({
  where: {
    numberField: {
      [Op.gt]: 50 // больше 50
    },
    booleanField: true
  }
});
```

### 3. Важные Примечания

- Все поля допускают null значения, кроме createdAt и updatedAt
- JSON поля автоматически сериализуются/десериализуются
- Для работы с ARRAY полями необходимо использовать PostgreSQL
- При работе с dateField учитывайте временные зоны

### 4. Миграции и Обновления
Для применения изменений в структуре базы данных используйте команды миграции.

## Команды Sequelize CLI

### Создание модели и миграции
```bash
# Создание модели с атрибутами
npx sequelize model:generate --name DataTypesExample \
  --attributes textField:string,numberField:integer,\
  decimalField:decimal,booleanField:boolean,\
  dateField:date,jsonField:json,\
  arrayField:array:string,enumField:enum
```

### Создание сида
```bash
# Генерация файла сида
npx sequelize seed:generate --name data-types-example
```

### Применение изменений
```bash
# Сброс и обновление базы данных
npm run db:reset

# Применение миграций
npx sequelize db:migrate

# Отмена последней миграции
npx sequelize db:migrate:undo

# Применение сидов
npx sequelize db:seed:all

# Отмена всех сидов
npx sequelize db:seed:undo:all
```