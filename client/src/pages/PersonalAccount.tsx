import React from 'react';
import { Container, Stack } from '@mui/material';
import BinanceBalance from '../components/BinanceBalance';
import BinanceOrders from '../components/BinanceOrders';
import BybitBalance from '../components/BybitBalance';
import BybitOrders from '../components/BybitOrders';

const PersonalAccount: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Stack spacing={2}>
        <BinanceBalance />
        <BinanceOrders />
        <BybitBalance />
        <BybitOrders />
      </Stack>
    </Container>
  );
};

export default PersonalAccount;