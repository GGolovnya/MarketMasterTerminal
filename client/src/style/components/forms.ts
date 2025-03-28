// Стили для форм и инпутов
export const formStyles = {
  // Контейнер формы
  container: {
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
  },

  // Поле ввода
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(144, 202, 249, 1)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(144, 202, 249, 1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputAdornment-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Чекбокс
  checkbox: {
    '& .MuiCheckbox-root': {
      color: 'rgba(144, 202, 249, 1)',
    },
  },

  // Сообщение об ошибке
  errorMessage: {
    color: 'rgba(244, 67, 54, 1)',
    fontSize: '0.75rem',
    marginTop: '4px',
  },

  // Подсказка
  helperText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.75rem',
    marginTop: '4px',
  },
};