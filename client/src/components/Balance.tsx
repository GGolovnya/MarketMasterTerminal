// Импорты необходимых библиотек и компонентов
import { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { layoutStyles } from '../style/components/layout';
import { ErrorBoundary } from 'react-error-boundary';

// URL для WebSocket соединения и интервал пинга
const WEBSOCKET_URL = 'ws://localhost:3000/ws/balance';
const PING_INTERVAL = 30000; // интервал пинга 30 секунд

// Стилизованный контейнер для отображения баланса
const BalanceContainer = styled(Paper)(({ theme }) => ({
  ...layoutStyles.card,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

// Стилизованный элемент для отображения информации о монете
const BalanceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
}));

// Интерфейс для типа баланса монеты
interface CoinBalance {
  symbol: string;
  amount: number;
  usdValue: number;
}

// Функция для преобразования строки в число с проверкой
const safeParseFloat = (value: string | number): number => {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? 0 : parsed;
};

// Функция для форматирования числа с указанной точностью
const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// Интерфейс ошибки
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Компонент для отображения ошибок
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <Box role="alert" sx={{ p: 2 }}>
    <Typography color="error" variant="h6" gutterBottom>
      Что-то пошло не так:
    </Typography>
    <Typography gutterBottom>
      {error.message}
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={resetErrorBoundary}
    >
      Попробовать снова
    </Button>
  </Box>
);

// Основной компонент Balance
const Balance = () => {
  // Состояния компонента
  const [balances, setBalances] = useState<CoinBalance[]>([]); // массив балансов
  const [totalBalance, setTotalBalance] = useState<number>(0); // общий баланс
  const [loading, setLoading] = useState<boolean>(true); // состояние загрузки
  const [error, setError] = useState<string | null>(null); // состояние ошибки
  const [wsConnected, setWsConnected] = useState<boolean>(false); // состояние подключения

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout;

    // Функция для установки WebSocket соединения
    const connectWebSocket = () => {
      if (ws?.readyState === WebSocket.OPEN) return;

      ws = new WebSocket(WEBSOCKET_URL);

      // Обработчик открытия соединения
      ws.onopen = () => {
        setLoading(false);
        setWsConnected(true);
        setError(null);

        // Запуск интервала пинга
        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, PING_INTERVAL);
      };

      // Обработчик получения сообщений
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());

          // Обработка разных типов сообщений
          if (data.type === 'pong') {
            return; // Игнорируем ответы пинга
          }

          if (data.type === 'balance' && data.balances && Array.isArray(data.balances)) {
            // Преобразование и валидация данных
            const processedBalances = data.balances.map(balance => ({
              symbol: balance.symbol,
              amount: safeParseFloat(balance.amount),
              usdValue: safeParseFloat(balance.usdValue),
            }));

            const totalValue = processedBalances.reduce(
              (sum, balance) => sum + balance.usdValue,
              0,
            );

            setBalances(processedBalances);
            setTotalBalance(totalValue);
          }
        } catch (err) {
          console.error('Ошибка обработки данных WebSocket:', err);
          setError('Ошибка обработки данных');
        }
      };

      // Обработчик ошибок
      ws.onerror = () => {
        setWsConnected(false);
        setError('Ошибка соединения с сервером');
      };

      // Обработчик закрытия соединения
      ws.onclose = () => {
        setWsConnected(false);
        clearInterval(pingInterval);
        // Попытка переподключения через 3 секунды
        setTimeout(connectWebSocket, 3000);
      };
    };

    // Инициализация соединения
    connectWebSocket();

    // Очистка при размонтировании компонента
    return () => {
      if (ws) {
        ws.close();
      }
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
  }, []);

  // Отрисовка компонента
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setError(null);
        setLoading(true);
        setWsConnected(false);
      }}
    >
      <BalanceContainer>
        {/* Отображение общего баланса */}
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Общий баланс: ${formatNumber(totalBalance)}
          {wsConnected && (
            <Typography variant="caption" color="success.main">
              (Live)
            </Typography>
          )}
        </Typography>

        {/* Условный рендеринг в зависимости от состояния */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box>
            {/* Отображение списка монет */}
            {balances.map((coin) => (
              <BalanceItem key={coin.symbol}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {coin.symbol}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(coin.amount, 8)}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${formatNumber(coin.usdValue)}
                  </Typography>
                </Box>
              </BalanceItem>
            ))}
          </Box>
        )}
      </BalanceContainer>
    </ErrorBoundary>
  );
};

export default Balance;