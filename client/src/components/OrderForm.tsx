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
    <Box sx={{
      ...styles.orderForm,
      p: 3,
      borderRadius: 2,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
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
        sx={{
          mb: 3,
          '& .MuiToggleButton-root': {
            py: 1.5,
            borderRadius: 1,
          },
        }}
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
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
        <TextField
          fullWidth
          label="Количество"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          required
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            ...orderType === 'buy' ? styles.buyButton : styles.sellButton,
            py: 1.5,
            borderRadius: 1,
            fontWeight: 600,
          }}
        >
          {orderType === 'buy' ? 'Купить' : 'Продать'}
        </Button>
      </form>
    </Box>
  );
}

export default OrderForm;