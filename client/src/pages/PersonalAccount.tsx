import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import BybitBalance from '../components/BybitBalance';
import BybitOrders from '../components/BybitOrders';

const PersonalAccount: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <BybitBalance />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <BybitOrders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PersonalAccount;
