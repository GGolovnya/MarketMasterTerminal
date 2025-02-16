import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';

const BybitOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Здесь будет логика получения ордеров
    // TODO: Добавить интеграцию с API Bybit
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ордера
      </Typography>
      {/* TODO: Добавить отображение ордеров */}
    </Box>
  );
};

export default BybitOrders;
