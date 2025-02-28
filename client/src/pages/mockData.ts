/**
 * Этот мок используется в PersonalAccount.tsx для отображения списка доступных бирж.
 * В реальном приложении эти данные будут приходить из БД с иным интерфейсом.
 *
 * Интерфейс реального запроса из БД будет следующим:
 */

// Текущий упрощенный интерфейс для мока
export interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
}

// Будущий интерфейс на основе структуры таблицы ExchangeApiKeys
export interface RealExchangeData {
  id: number; // ID самого подключения
  userId: number; // Id пользователя к которому относится подключение
  exchangeName: string; // Название биржи
  nickName: string; // Псевдоним названия подключения
  apiKey: string;      // Зашифрованный ключ API
  apiKeyIv: string;    // Вектор инициализации для ключа API
  apiKeyAuthTag: string; // Тег аутентификации для ключа API
  apiSecret: string;   // Зашифрованный секрет API
  apiSecretIv: string; // Вектор инициализации для секрета API
  apiSecretAuthTag: string; // Тег аутентификации для секрета API
  isActive: boolean; // Статус подключения активно или не активно
  createdAt: Date;
  updatedAt: Date;
}

export const exchanges: Exchange[] = [
  {
    id: 'exchange_binance_01',
    name: 'Binance',
    isConnected: false,
  },
  {
    id: 'exchange_bybit_02',
    name: 'Bybit',
    isConnected: true,
  },
  {
    id: 'exchange_bybit_03',
    name: 'Кракен',
    isConnected: false,
  },
];