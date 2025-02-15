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
  Divider,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Visibility, VisibilityOff, Email, Google, GitHub } from '@mui/icons-material';
import { theme } from '../style/theme';
import { buttonStyles } from '../style/components/buttons';
import { formStyles } from '../style/components/forms';
import { layoutStyles } from '../style/components/layout';

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

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={layoutStyles.flex}>
        <Paper sx={formStyles.container}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color={theme.palette.primary.main}>
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
              sx={formStyles.input}
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
              sx={formStyles.input}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Забыли пароль?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={buttonStyles.primary}
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
                sx={buttonStyles.secondary}
              >
                Войти через Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={handleGithubLogin}
                sx={buttonStyles.secondary}
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