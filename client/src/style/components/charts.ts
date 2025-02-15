// Стили для графиков и диаграмм
export const chartStyles = {
  // Контейнер графика
  container: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: '12px',
    padding: '24px',
    height: '500px',
  },

  // Заголовок графика
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#ffffff',
  },

  // Легенда
  legend: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    '& .legend-item': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Оси
  axis: {
    '& line': {
      stroke: 'rgba(255, 255, 255, 0.1)',
    },
    '& text': {
      fill: 'rgba(255, 255, 255, 0.7)',
      fontSize: '12px',
    },
  },

  // Сетка
  grid: {
    stroke: 'rgba(255, 255, 255, 0.05)',
    strokeDasharray: '4',
  },

  // Линия тренда
  trendLine: {
    stroke: '#90caf9',
    strokeWidth: 2,
  },
};