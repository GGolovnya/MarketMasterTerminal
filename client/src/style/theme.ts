import { createTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';

// Объединенная тема для Material UI и пользовательских компонентов
export const theme: Theme = createTheme({
  // Основная цветовая палитра Material UI
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(144, 202, 249, 1)', // Основной цвет для кнопок, ссылок и акцентов
    },
    secondary: {
      main: 'rgba(244, 143, 177, 1)', // Вторичный цвет для менее важных элементов
    },
    success: {
      main: 'rgba(76, 175, 80, 1)', // Цвет успешных действий
    },
    error: {
      main: 'rgba(244, 67, 54, 1)', // Цвет ошибок и предупреждений
    },
    warning: {
      main: 'rgba(255, 152, 0, 1)', // Цвет предупреждений
    },
    info: {
      main: 'rgba(33, 150, 243, 1)', // Цвет информационных сообщений
    },
    background: {
      default: 'rgba(18, 18, 18, 1)', // Основной цвет фона
      paper: 'rgba(18, 18, 18, 0.95)', // Цвет фона карточек и панелей
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)', // Основной цвет текста
      secondary: 'rgba(255, 255, 255, 0.7)', // Цвет второстепенного текста
    },
  },

  // Настройки типографики
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },

  // Пользовательские настройки
  components: {
    // Настройки отступов
    spacing: {
      xs: '0.5rem', // Очень маленький отступ
      sm: '1rem',   // Маленький отступ
      md: '1.5rem', // Средний отступ
      lg: '2rem',   // Большой отступ
      xl: '3rem',   // Очень большой отступ
    },

    // Настройки скруглений углов
    borderRadius: {
      sm: '4px',  // Маленькое скругление
      md: '8px',  // Среднее скругление
      lg: '12px', // Большое скругление
      xl: '16px', // Очень большое скругление
    },

    // Настройки теней
    shadows: {
      sm: 'rgba(0, 0, 0, 0.1) 0 2px 4px',  // Легкая тень
      md: 'rgba(0, 0, 0, 0.1) 0 4px 8px',  // Средняя тень
      lg: 'rgba(0, 0, 0, 0.1) 0 8px 16px', // Сильная тень
    },

    // Настройки анимаций
    transitions: {
      duration: {
        short: '150ms',  // Короткая анимация
        medium: '300ms', // Средняя анимация
        long: '500ms',   // Длинная анимация
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Плавное ускорение и замедление
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',   // Плавное замедление
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',      // Плавное ускорение
      },
    },
  },
});