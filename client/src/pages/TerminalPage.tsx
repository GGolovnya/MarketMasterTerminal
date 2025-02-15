import { Container, Grid } from '@mui/material';
import CryptoList from '../components/CryptoList';
import TradingChart from '../components/TradingChart';
import OrderForm from '../components/OrderForm';
import OpenOrders from '../components/OpenOrders';
import Balance from '../components/Balance';

function Terminal() {
  return (
    <Container maxWidth={false} sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={4} sx={{ height: '60vh' }}>
          <TradingChart />
        </Grid>
        <Grid item xs={4} sx={{ height: '60vh' }}>
          <OrderForm />
        </Grid>
        <Grid item xs={4} sx={{ height: '60vh' }}>
          <OpenOrders />
          <Balance />
        </Grid>
        <Grid item xs={12} sx={{ height: '25vh' }}>
          <CryptoList />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Terminal;