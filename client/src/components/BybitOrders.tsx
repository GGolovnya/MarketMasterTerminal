import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import axiosInstance from '../utils/axiosInstance';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrdersContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const OrderItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
}));

interface Order {
  symbol: string;
  orderId: string;
  price: string;
  quantity: string;
  side: 'BUY' | 'SELL';
  status: string;
}

const BybitOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    console.log('Начало fetchOrders, isAuthenticated:', isAuthenticated);
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/api/bybit/open-orders');

      if (data?.result?.list) {
        setOrders(data.result.list);
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
    <OrdersContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Открытые ордера ByBit</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
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
      {orders.length > 0 ? (
        <Box>
          {orders.map((order) => (
            <OrderItem key={order.orderId}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {order.symbol}
                </Typography>
                <Chip
                  label={order.side}
                  color={getSideColor(order.side)}
                  size="small"
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Цена: {order.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Количество: {order.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.status}
                </Typography>
              </Box>
            </OrderItem>
          ))}
        </Box>
      ) : (
        <Typography sx={{ mt: 2 }}>Нет открытых ордеров</Typography>
      )}
    </OrdersContainer>
  );
};

export default BybitOrders;