const crypto = require('crypto');

// Определяем параметры шифрования
const algorithm = 'aes-256-gcm';      // Алгоритм шифрования AES с режимом GCM
const keyLength = 32;                 // Длина ключа 256 бит
const ivLength = 12;                  // Длина вектора инициализации 96 бит
const saltLength = 16;                // Длина соли для генерации ключа
const tagLength = 16;                 // Длина тега аутентификации

// Получаем мастер-ключ из переменной окружения или генерируем случайный
const masterKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(keyLength).toString('hex');

// Функция для генерации ключа шифрования на основе мастер-ключа и соли
// Использует PBKDF2 для усиления безопасности
function generateKey(salt) {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, keyLength, 'sha256');
}

// Функция шифрования
function encrypt(text) {
  // Генерируем случайные IV и соль
  const iv = crypto.randomBytes(ivLength);
  const salt = crypto.randomBytes(saltLength);
  // Получаем ключ шифрования
  const key = generateKey(salt);

  // Создаем шифр с заданными параметрами
  const cipher = crypto.createCipheriv(algorithm, key, iv, { authTagLength: tagLength });
  
  // Шифруем данные
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Получаем тег аутентификации
  const authTag = cipher.getAuthTag();

  // Возвращаем результат
  return {
    encrypted: salt.toString('hex') + encrypted,  // Соль + зашифрованный текст
    iv: iv.toString('hex'),                      // Вектор инициализации
    authTag: authTag.toString('hex')             // Тег аутентификации
  };
}

// Функция расшифрования
function decrypt(encryptedText, iv, authTag) {
  // Извлекаем соль из зашифрованного текста
  const salt = Buffer.from(encryptedText.slice(0, saltLength * 2), 'hex');
  const encrypted = encryptedText.slice(saltLength * 2);
  // Получаем ключ расшифрования
  const key = generateKey(salt);

  // Создаем дешифратор
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'), {
    authTagLength: tagLength
  });

  // Устанавливаем тег аутентификации
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  // Расшифровываем данные
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};