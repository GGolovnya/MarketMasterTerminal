// Стили для таблиц
export const tableStyles = {
  // Контейнер таблицы
  container: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: '12px',
    overflow: 'hidden',
  },

  // Заголовок таблицы
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& th': {
      fontWeight: 600,
      padding: '16px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Ячейки таблицы
  cell: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Строки таблицы
  row: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    transition: 'background-color 0.2s',
  },

  // Положительное значение
  positive: {
    color: 'rgba(76, 175, 80, 1)',
  },

  // Отрицательное значение
  negative: {
    color: 'rgba(244, 67, 54, 1)',
  },

  // Пагинация
  pagination: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '8px',
  },
};