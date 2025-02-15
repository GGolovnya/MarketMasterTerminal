// src/components/Navigation.tsx
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Главная
          </Button>
          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/terminal">
                Торговый терминал
              </Button>
            </>
          )}
        </Box>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
                Личный кабинет
            </Button>
            <Button color="inherit" onClick={handleLogout}>
            Выйти
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Войти
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};