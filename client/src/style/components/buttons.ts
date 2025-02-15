// Стили для кнопок
export const buttonStyles = {
  // Основная кнопка
  primary: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1AC6E9 90%)',
    },
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
  },

  // Вторичная кнопка
  secondary: {
    border: '1px solid #90caf9',
    color: '#90caf9',
    '&:hover': {
      backgroundColor: 'rgba(144, 202, 249, 0.08)',
    },
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
  },

  // Кнопка покупки
  buy: {
    backgroundColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
    color: '#ffffff',
  },

  // Кнопка продажи
  sell: {
    backgroundColor: '#f44336',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
    color: '#ffffff',
  },

  // Иконка кнопки
  icon: {
    marginRight: '8px',
    fontSize: '20px',
  },

  // Отключенное состояние
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};