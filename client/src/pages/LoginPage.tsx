import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../style/components.styles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Ошибка входа. Проверьте email и пароль.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={styles.loginContainer}>
        <Paper elevation={3} sx={styles.loginPaper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Вход в систему
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={styles.loginButton}
            >
              Войти
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;