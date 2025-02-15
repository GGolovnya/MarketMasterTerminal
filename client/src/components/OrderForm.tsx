import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { formStyles } from '../style/components/forms';
import { buttonStyles } from '../style/components/buttons';
import { layoutStyles } from '../style/components/layout';

function OrderForm() {
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки ордера
    console.log({ orderType, amount, price });
  };

  return (
    <Box sx={layoutStyles.card}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: 600,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
        }}
      >
        Создать ордер
      </Typography>
      <ToggleButtonGroup
        value={orderType}
        exclusive
        onChange={(_, value) => value && setOrderType(value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="buy" sx={buttonStyles.buy}>
          Купить
        </ToggleButton>
        <ToggleButton value="sell" sx={buttonStyles.sell}>
          Продать
        </ToggleButton>
      </ToggleButtonGroup>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
          required
          sx={formStyles.input}
        />
        <TextField
          fullWidth
          label="Количество"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          required
          sx={formStyles.input}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={orderType === 'buy' ? buttonStyles.buy : buttonStyles.sell}
        >
          {orderType === 'buy' ? 'Купить' : 'Продать'}
        </Button>
      </form>
    </Box>
  );
}

export default OrderForm;