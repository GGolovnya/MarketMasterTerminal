import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { layoutStyles } from '../style/components/layout';
import { buttonStyles } from '../style/components/buttons';

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={layoutStyles.navigation}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={buttonStyles.secondary}
          >
            Главная
          </Button>
          {isAuthenticated && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/terminal"
                sx={buttonStyles.secondary}
              >
                Торговый терминал
              </Button>
            </>
          )}
        </Box>
        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/profile"
              sx={buttonStyles.secondary}
            >
              Личный кабинет
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={buttonStyles.secondary}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={buttonStyles.secondary}
            >
              Войти
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              sx={buttonStyles.primary}
            >
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};