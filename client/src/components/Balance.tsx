import { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { layoutStyles } from '../style/components/layout';
import { theme } from '../style/theme';
import { ErrorBoundary } from 'react-error-boundary';

const WEBSOCKET_URL = 'ws://localhost:3000/ws/balance';
const FALLBACK_INTERVAL = 20000;
const MIN_BALANCE_USD = 1;

const BalanceContainer = styled(Paper)(({ theme }) => ({
  ...layoutStyles.card,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

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

interface CoinBalance {
  symbol: string;
  amount: number;
  usdValue: number;
}

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box role="alert">
    <Typography color="error">Что-то пошло не так:</Typography>
    <Typography>{error.message}</Typography>
    <button onClick={resetErrorBoundary}>Попробовать снова</button>
  </Box>
);

const Balance = () => {
  const [balances, setBalances] = useState<CoinBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: NodeJS.Timeout;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (ws?.readyState === WebSocket.OPEN) return;

      ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        setLoading(false);
        setWsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          if (data.balances && Array.isArray(data.balances)) {
            setBalances(data.balances);
            setTotalBalance(data.totalBalance || 0);
          }
          setIsUpdating(false);
        } catch (err) {
          console.error('Ошибка обработки данных WebSocket:', err);
          setError('Ошибка обработки данных');
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
        setError('Ошибка соединения с сервером');
        initializeFallback();
      };

      ws.onclose = () => {
        setWsConnected(false);
        // Попытка переподключения через 3 секунды
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };
    };

    const initializeFallback = async () => {
      const fetchBalance = async () => {
        setIsUpdating(true);
        try {
          const response = await fetch('/api/balance');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.balances && Array.isArray(data.balances)) {
            setBalances(data.balances);
            setTotalBalance(data.totalBalance || 0);
          }
          setError(null);
        } catch (err) {
          setError('Не удалось получить актуальный баланс');
          console.error('Ошибка получения баланса:', err);
        } finally {
          setIsUpdating(false);
        }
      };

      await fetchBalance();
      fallbackInterval = setInterval(fetchBalance, FALLBACK_INTERVAL);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BalanceContainer>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          Общий баланс: ${(totalBalance || 0).toFixed(2)}
          {isUpdating && <CircularProgress size={20} />}
          {wsConnected && (
            <Typography variant="caption" color="success.main">
              (Live)
            </Typography>
          )}
        </Typography>

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
            {balances.map((coin) => (
              <BalanceItem key={coin.symbol}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {coin.symbol}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    {(coin.amount || 0).toFixed(8)}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${(coin.usdValue || 0).toFixed(2)}
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