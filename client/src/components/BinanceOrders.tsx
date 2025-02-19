import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrdersContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  width: '100%',
}));

interface Order {
  symbol: string;
  orderId: string;
  price: string;
  origQty: string;
  side: 'BUY' | 'SELL';
  status: string;
  type: string;
  time: string;
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
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(parseInt(dateString)).toLocaleString();
  };

  return (
    <OrdersContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Пара</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Направление</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>
                  <Chip
                    label={order.side}
                    color={order.side === 'BUY' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.origQty}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatDate(order.time)}</TableCell>
                <TableCell>{order.orderId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {orders.length === 0 && !loading && (
        <Typography sx={{ mt: 2 }}>Нет открытых ордеров</Typography>
      )}
    </OrdersContainer>
  );
};

export default BinanceOrders;