import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
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
    <Box sx={styles.openOrders}>
      <Typography variant="h6" gutterBottom>
          Открытые ордера
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Пара</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Всего</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.pair}</TableCell>
              <TableCell>
                <Typography
                  color={order.type === 'buy' ? 'success.main' : 'error.main'}
                >
                  {order.type === 'buy' ? 'Покупка' : 'Продажа'}
                </Typography>
              </TableCell>
              <TableCell align="right">${order.price}</TableCell>
              <TableCell align="right">{order.amount}</TableCell>
              <TableCell align="right">${order.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default OpenOrders;