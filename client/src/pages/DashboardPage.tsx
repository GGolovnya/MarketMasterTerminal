import { Container, Grid, Paper, Typography } from '@mui/material';
import CryptoList from '../components/CryptoList';
import TradingChart from '../components/TradingChart';
import OrderForm from '../components/OrderForm';
import OpenOrders from '../components/OpenOrders';
import { styles } from '../style/components.styles';

function Dashboard() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Market Master Terminal
      </Typography>
      <Grid container spacing={3} sx={styles.dashboardContainer}>
        <Grid item xs={12} md={8}>
          <Paper sx={styles.chartPaper}>
            <TradingChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={styles.ordersPaper}>
            <OrderForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper>
            <CryptoList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={styles.openOrdersPaper}>
            <OpenOrders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;