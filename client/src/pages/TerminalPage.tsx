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
      <Typography variant="h4" component="h1" sx={layoutStyles.title}>
        Market Master Terminal
      </Typography>
      <Grid container spacing={3} sx={layoutStyles.grid}>
        <Grid item xs={12} md={8}>
          <Paper sx={chartStyles.container}>
            <TradingChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={layoutStyles.card}>
            <OrderForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={layoutStyles.card}>
            <CryptoList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={layoutStyles.card}>
            <OpenOrders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Terminal;