import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { styles } from '../style/components.styles';

interface Order {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  status: string;
}

function OpenOrders() {
  const orders: Order[] = []; // Здесь будут данные из API

  return (
    <Box sx={{ ...styles.openOrders, p: 3, borderRadius: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 600,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
        }}
      >
        Открытые ордера
      </Typography>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <TableCell sx={{ py: 2 }}>Пара</TableCell>
              <TableCell sx={{ py: 2 }}>Тип</TableCell>
              <TableCell align="right" sx={{ py: 2 }}>Цена</TableCell>
              <TableCell align="right" sx={{ py: 2 }}>Количество</TableCell>
              <TableCell align="right" sx={{ py: 2 }}>Всего</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ py: 2 }}>{order.pair}</TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    color={order.type === 'buy' ? 'success.main' : 'error.main'}
                    sx={{
                      fontWeight: 500,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      backgroundColor: order.type === 'buy'
                        ? 'rgba(46, 125, 50, 0.1)'
                        : 'rgba(211, 47, 47, 0.1)',
                    }}
                  >
                    {order.type === 'buy' ? 'Покупка' : 'Продажа'}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ py: 2 }}>${order.price}</TableCell>
                <TableCell align="right" sx={{ py: 2 }}>{order.amount}</TableCell>
                <TableCell align="right" sx={{ py: 2 }}>${order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default OpenOrders;