import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Stack,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { styles } from '../style/components.styles';
import { useNavigate } from 'react-router-dom';
import { Lock, Visibility, VisibilityOff, Email, Google, GitHub } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError('Введите корректный email адрес');
      return false;
    }
    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setSuccessMessage('Вход выполнен успешно! Перенаправляем...');
      setTimeout(() => {
        navigate('/terminal');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/terminal');
    } catch (err: any) {
      setError('Ошибка при входе через Google');
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      navigate('/terminal');
    } catch (err: any) {
      setError('Ошибка при входе через GitHub');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{
        ...styles.loginContainer,
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Paper elevation={6} sx={{
          p: 4,
          width: '100%',
          borderRadius: '12px',
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
        }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#90caf9' }}>
            Вход в систему
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="example@email.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              placeholder="Минимум 8 символов"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1AC6E9 90%)',
                },
                mb: 2
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
            <Divider sx={{ my: 2 }}>или</Divider>
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{ py: 1.2 }}
              >
                Войти через Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={handleGithubLogin}
                sx={{ py: 1.2 }}
              >
                Войти через GitHub
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        message={successMessage}
      />
    </Container>
  );
}

export default Login;