import { Container, Grid, Paper, Typography } from '@mui/material';
import CryptoList from '../components/CryptoList';
import TradingChart from '../components/TradingChart';
import OrderForm from '../components/OrderForm';
import OpenOrders from '../components/OpenOrders';
import { layoutStyles } from '../style/components/layout';
import { chartStyles } from '../style/components/charts';

function Terminal() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Верхний ряд */}
        <Grid item xs={8}>
          <Paper sx={{ ...chartStyles.container, height: '60vh' }}>
            <TradingChart />
          </Paper>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
          <Paper sx={{ ...layoutStyles.card, mb: 2, flex: '0 0 auto' }}>
            <OrderForm />
          </Paper>
          <Paper sx={{ ...layoutStyles.card, flex: 1, overflowY: 'auto' }}>
            <OpenOrders />
          </Paper>
        </Grid>

        {/* Нижний ряд */}
        <Grid item xs={12} sx={{ height: '25vh' }}>
          <Paper sx={{ ...layoutStyles.card, height: '100%', overflowY: 'auto' }}>
            <CryptoList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Terminal;