// Стили для компоновки и сетки
export const layoutStyles = {
  // Основной контейнер
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '24px',
  },

  // Сетка
  grid: {
    display: 'grid',
    gap: '24px',
  },

  // Флекс контейнер
  // Использование: (формы логирования и регистрации)
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 124px)',
    gap: '16px',
  },

  // Карточка
  card: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  // Навигация
  navigation: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },

  // Боковая панель
  sidebar: {
    width: '280px',
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    padding: '24px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
  },

  // Основной контент
  content: {
    marginLeft: '280px',
    padding: '24px',
  },
};