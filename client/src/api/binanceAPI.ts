const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

export interface TickerData {
  symbol: string;
  price: string;
  priceChangePercent: string;
  volume: string;
}

export const connectWebSocket = (onMessage: (data: TickerData) => void) => {
  const ws = new WebSocket(BINANCE_WS_URL);

  ws.onopen = () => {
    // Подписываемся на стримы популярных пар
    const subscribeMsg = {
      method: 'SUBSCRIBE',
      params: [
        'btcusdt@ticker',
        'ethusdt@ticker',
        'bnbusdt@ticker',
      ],
      id: 1,
    };
    ws.send(JSON.stringify(subscribeMsg));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.e === '24hrTicker') {
      const tickerData: TickerData = {
        symbol: data.s,
        price: data.c,
        priceChangePercent: data.P,
        volume: data.v,
      };
      onMessage(tickerData);
    }
  };

  return ws;
};