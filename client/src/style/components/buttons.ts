// Создаем базовый градиентный стиль
const baseGradientStyle = {
  background: 'linear-gradient(45deg, rgba(33, 149, 243, 0.7) 30%, rgba(33, 203, 243, 0.9) 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.7) 30%, rgba(26, 198, 233, 0.9) 90%)',
  },
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: 600,
  textTransform: 'none',
};

// Стили для кнопок
export const buttonStyles = {
  // Основная кнопка (примерняется: меню хедер)
  primary: {
    ...baseGradientStyle,
    padding: '12px 24px',
    borderRadius: '8px',
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

  //Кнопка удаления
  deleteButton: {
    color: 'red',
    fontSize: '18px',
    '&:hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.04)',
    },
  },

  // Кнопка редактирвоания
  editButton: {
    color: 'orange',
    fontSize: '18px',
    '&:hover': {
      backgroundColor: 'rgba(255, 152, 0, 0.04)',
    },
  },

  // Кнопка подключения к бирже в личном кабинете
  connectButton: {
    ...baseGradientStyle,
    padding: '8px 16px',
  },
};