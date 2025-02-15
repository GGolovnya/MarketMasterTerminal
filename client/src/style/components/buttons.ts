// Стили для кнопок
export const buttonStyles = {
  // Основная кнопка (примерняется: меню хедер)
  primary: {
    background: 'linear-gradient(45deg, rgba(33, 149, 243, 0.7) 30%, rgba(33, 203, 243, 0.9) 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.7) 30%, rgba(26, 198, 233, 0.9) 90%)',
    },
    padding: '12px 24px',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: 600,
    textTransform: 'none',
  },

  // Вторичная кнопка (примерняется: меню хедер)
  secondary: {
    border: '1px solid rgba(144, 202, 249, 1)',
    color: 'rgba(144, 202, 249, 1)',
    '&:hover': {
      backgroundColor: 'rgba(144, 202, 249, 0.08)',
    },
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
  },

  // Кнопка покупки
  buy: {
    backgroundColor: 'rgba(76, 175, 80, 1)',
    '&:hover': {
      backgroundColor: 'rgb(43, 117, 46)',
    },
    color: 'rgba(255, 255, 255, 1)',
  },

  // Кнопка продажи
  sell: {
    backgroundColor: 'rgba(244, 67, 54, 1)',
    '&:hover': {
      backgroundColor: 'rgb(163, 35, 35)',
    },
    color: 'rgba(255, 255, 255, 1)',
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