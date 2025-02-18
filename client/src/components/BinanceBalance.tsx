import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface Balance {
  asset: string;
  free: number;
  locked: number;
}

const BybitBalance: React.FC = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/bybit/balance');
      if (data?.result?.list) {
        setBalances(data.result.list);
        enqueueSnackbar('Баланс успешно обновлен', { variant: 'success' });
      } else {
        throw new Error('Некорректный формат данных');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Ошибка получения баланса';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
      console.error('Ошибка при получении баланса:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const formatNumber = (num: number) => {
    return num.toFixed(8).replace(/\.?0+$/, '');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Баланс</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchBalance}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {balances.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {balances.map((balance) => (
            <Box
              key={balance.asset}
              display="flex"
              justifyContent="space-between"
              mb={1}
              sx={{
                p: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography fontWeight="bold">{balance.asset}</Typography>
              <Box>
                <Typography component="span" sx={{ mr: 2 }}>
                  {formatNumber(balance.free)} (доступно)
                </Typography>
                {balance.locked > 0 && (
                  <Typography component="span" color="warning.main">
                    {formatNumber(balance.locked)} (в ордерах)
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BybitBalance;