/**
 * Этот модуль содержит список доступных бирж для торговли.
 * Используется в PersonalAccount.tsx для отображения доступных опций подключения.
 */

// Базовый интерфейс биржи
export interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
}

// Функция-замыкание, возвращающая список доступных бирж
export const getAvailableExchanges = (): Exchange[] => {
  return [
    {
      id: 'exchange_binance_01',
      name: 'Binance',
      isConnected: false,
    },
    {
      id: 'exchange_bybit_02',
      name: 'Bybit',
      isConnected: false,
    },
    {
      id: 'exchange_kraken_03',
      name: 'Kraken',
      isConnected: false,
    },
    {
      id: 'exchange_okx_04',
      name: 'OKX',
      isConnected: false,
    },
    {
      id: 'exchange_kucoin_05',
      name: 'KuCoin',
      isConnected: false,
    },
    {
      id: 'exchange_gateio_06',
      name: 'Gate.io',
      isConnected: false,
    },
    {
      id: 'exchange_huobi_07',
      name: 'Huobi',
      isConnected: false,
    },
    {
      id: 'exchange_mexc_08',
      name: 'MEXC',
      isConnected: false,
    },
  ];
};