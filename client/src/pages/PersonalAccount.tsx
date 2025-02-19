import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import BinanceBalance from '../components/BinanceBalance';
import BinanceOrders from '../components/BinanceOrders';
import BybitBalance from '../components/BybitBalance';
import BybitOrders from '../components/BybitOrders';

const PersonalAccount: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <BinanceBalance />
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: 2 }}>
            <BinanceOrders />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <BybitBalance />
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: 2 }}>
            <BybitOrders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PersonalAccount;