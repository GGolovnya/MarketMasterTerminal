import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Button, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  symbol: string;
  orderId: string;
  price: string;
  origQty: string;
  side: 'BUY' | 'SELL';
  status: string;
  type: string;
}

const BinanceOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/binance/open-orders');

      if (data?.orders) {
        setOrders(data.orders);
        enqueueSnackbar('Ордера успешно обновлены', { variant: 'success' });
      } else {
        throw new Error('Некорректный формат данных');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        enqueueSnackbar('Сессия истекла. Пожалуйста, войдите снова', { variant: 'error' });
        // navigate('/login');
        return;
      }
      const errorMsg = err.response?.data?.message || 'Ошибка получения ордеров';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
      console.error('Ошибка при получении ордеров:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const getSideColor = (side: 'BUY' | 'SELL') => {
    return side === 'BUY' ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Открытые ордера Binance</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {orders.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          {orders.map((order) => (
            <Box
              key={order.orderId}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {order.symbol}
                </Typography>
                <Chip
                  label={order.side}
                  color={getSideColor(order.side)}
                  size="small"
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>
                  Цена: {order.price}
                </Typography>
                <Typography>
                  Количество: {order.origQty}
                </Typography>
                <Typography color="textSecondary">
                  {order.type} - {order.status}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 2 }}>Нет открытых ордеров</Typography>
      )}
    </Box>
  );
};

export default BinanceOrders;