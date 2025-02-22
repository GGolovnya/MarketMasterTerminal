import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

const PersonalAccount: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Paper sx={{
        width: 300,
        height: 100,
        marginTop: 2,
      }}>
        <Typography sx={{
          alignItems: 'center',
        }}>
          Выбранная биржа
        </Typography>
      </Paper>
    </Container>
  );
};

export default PersonalAccount;