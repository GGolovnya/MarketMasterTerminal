import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';

const BybitBalance: React.FC = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Здесь будет логика получения баланса
    // TODO: Добавить интеграцию с API Bybit
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Баланс
      </Typography>
      {/* TODO: Добавить отображение баланса */}
    </Box>
  );
};

export default BybitBalance;
