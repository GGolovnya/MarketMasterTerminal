import { useState } from 'react';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import Balance from '../components/TerminalPage/Balance';
import CryptoList from '../components/TerminalPage/CryptoList';
import OrderForm from '../components/TerminalPage/OrderForm';
import BinanceBalance from '../components/TerminalPage/BinanceBalance';
import BinanceOrders from '../components/TerminalPage/BinanceOrders';
import BybitBalance from '../components/TerminalPage/BybitBalance';
import BybitOrders from '../components/TerminalPage/BybitOrders';

function Terminal() {
  const [exchange, setExchange] = useState('bybit');

  return (
    <Container maxWidth={false} sx={{ width: '100%', p: 2 }}>

      <Grid container spacing={1}>
        <Grid item sx={{ height: 100 }}>
          <Typography>Подключено бирж: 2</Typography>
          <Select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            sx={{ minWidth: 160, height: 40 }}
          >
            <MenuItem value='binance'>Binance</MenuItem>
            <MenuItem value='bybit'>ByBit</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4} sx={{ height: '60vh' }}>
          <Balance />
        </Grid>
        <Grid item xs={4} sx={{ height: '60vh' }}>
          <OrderForm />
        </Grid>
        <Grid item xs={12} sx={{ height: '25vh' }}>
          <CryptoList />
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <BinanceBalance />
        <BinanceOrders />
        <BybitBalance />
        <BybitOrders />
      </Stack>
    </Container>
  );
}

export default Terminal;