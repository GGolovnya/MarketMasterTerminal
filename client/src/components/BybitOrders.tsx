import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axiosInstance from '../utils/axiosInstance';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrdersContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

interface Order {
  symbol: string;
  market: string;
  orderType: string;
  orderId: string;
  price: string;
  executed: string;
  leavesValue: string;
  leavesQty: string;
  side: 'BUY' | 'SELL';
  status: string;
  stopLoss: string;
  takeProfit: string;
  createdTime: string;
}

const BybitOrders: React.FC = () => {
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

  const formatNumber = (num: string) => {
    return parseFloat(num).toFixed(8).replace(/\.?0+$/, '');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axiosInstance.delete(`/api/bybit/orders/${orderId}`);
      enqueueSnackbar('Ордер успешно удален', { variant: 'success' });
      fetchOrders();
    } catch (err) {
      enqueueSnackbar('Ошибка при удалении ордера', { variant: 'error' });
    }
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
              <TableCell>Рынок</TableCell>
              <TableCell>Тип ордера</TableCell>
              <TableCell>Направление</TableCell>
              <TableCell>Цена исполнения</TableCell>
              <TableCell>Исполнено</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Стоимость ордера</TableCell>
              <TableCell>TP/SL</TableCell>
              <TableCell>Время ордера</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.market || 'SPOT'}</TableCell>
                <TableCell>{order.orderType}</TableCell>
                <TableCell>
                  <Chip
                    label={order.side}
                    color={order.side === 'BUY' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatNumber(order.price)}$</TableCell>
                <TableCell>{formatNumber(order.executed)}%</TableCell>
                <TableCell>{formatNumber(order.leavesValue)}</TableCell>
                <TableCell>{formatNumber(order.leavesQty)}$</TableCell>
                <TableCell>
                  {order.takeProfit && `TP: ${formatNumber(order.takeProfit)}$`}
                  {order.stopLoss && <br/>}
                  {order.stopLoss && `SL: ${formatNumber(order.stopLoss)}$`}
                </TableCell>
                <TableCell>{formatDate(order.createdTime)}</TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteOrder(order.orderId)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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

export default BybitOrders;