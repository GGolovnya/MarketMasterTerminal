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
import { tableStyles } from '../style/components/tables';
import { layoutStyles } from '../style/components/layout';

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
    <Box sx={layoutStyles.card}>
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
      <Paper sx={tableStyles.container}>
        <Table size="small">
          <TableHead>
            <TableRow sx={tableStyles.header}>
              <TableCell>Пара</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell align="right">Цена</TableCell>
              <TableCell align="right">Количество</TableCell>
              <TableCell align="right">Всего</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={tableStyles.row}
              >
                <TableCell sx={tableStyles.cell}>{order.pair}</TableCell>
                <TableCell sx={tableStyles.cell}>
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
                <TableCell align="right" sx={tableStyles.cell}>${order.price}</TableCell>
                <TableCell align="right" sx={tableStyles.cell}>{order.amount}</TableCell>
                <TableCell align="right" sx={tableStyles.cell}>${order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default OpenOrders;