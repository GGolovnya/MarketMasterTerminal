import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { layoutStyles } from '../style/components/layout';
import { ErrorBoundary } from 'react-error-boundary';

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

  // Функция для получения баланса
  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/balance');
      const data = await response.json();

      if (data.balances && Array.isArray(data.balances)) {
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
      console.error('Ошибка получения баланса:', err);
      setError('Ошибка получения данных');
    } finally {
      setLoading(false);
    }
  };

  // Получение баланса при первом рендере
  useEffect(() => {
    fetchBalance();
  }, []);

  // Отрисовка компонента
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setError(null);
        setLoading(true);
        fetchBalance();
      }}
    >
      <BalanceContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Общий баланс: ${formatNumber(totalBalance)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchBalance}
            disabled={loading}
          >
            Обновить
          </Button>
        </Box>

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