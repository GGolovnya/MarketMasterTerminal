import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BalanceContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  width: '100%',
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

interface Balance {
  symbol: string;
  amount: number;
  usdValue: number;
}

const BinanceBalance: React.FC = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/binance/balance');

      if (data?.binanceBalances) {
        setBalances(data.binanceBalances);
        enqueueSnackbar('Баланс успешно обновлен', { variant: 'success' });
      } else {
        throw new Error('Некорректный формат данных');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        enqueueSnackbar('Сессия истекла. Пожалуйста, войдите снова', { variant: 'error' });
        return;
      }
      const errorMsg = err.response?.data?.message || 'Ошибка получения баланса';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
      console.error('Ошибка при получении баланса:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchBalance();
  }, [isAuthenticated, navigate]);

  const formatNumber = (num: number) => {
    return num.toFixed(8).replace(/\.?0+$/, '');
  };

  return (
    <BalanceContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Баланс Binance</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchBalance}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {balances.length > 0 && (
        <Box>
          {balances.map((balance) => (
            <BalanceItem key={balance.symbol}>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {balance.symbol}
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(balance.amount)}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${balance.usdValue.toFixed(2)}
                </Typography>
              </Box>
            </BalanceItem>
          ))}
        </Box>
      )}
    </BalanceContainer>
  );
};

export default BinanceBalance;