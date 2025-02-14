import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styles } from '../style/components.styles';

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
    <Box sx={styles.orderForm}>
      <Typography variant="h6" gutterBottom>
        Создать ордер
      </Typography>
      <ToggleButtonGroup
        value={orderType}
        exclusive
        onChange={(_, value) => value && setOrderType(value)}
        fullWidth
        sx={styles.toggleGroup}
      >
        <ToggleButton value="buy" sx={styles.buyButton}>
          Купить
        </ToggleButton>
        <ToggleButton value="sell" sx={styles.sellButton}>
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
        />
        <TextField
          fullWidth
          label="Количество"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={orderType === 'buy' ? styles.buyButton : styles.sellButton}
        >
          {orderType === 'buy' ? 'Купить' : 'Продать'}
        </Button>
      </form>
    </Box>
  );
}

export default OrderForm;