export const stylePersonalAccount = {

  // Стиль для основного контейнера страницы
  personalAccountContainerStyle: {
    marginLeft: 2,
    marginRight: 2,
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    scrollbarWidth: 'none', // Скрывает полосу прокрутки в Firefox
    msOverflowStyle: 'none', // Скрывает полосу прокрутки в IE/Edge
    '&::-webkit-scrollbar': { // Скрывает полосу прокрутки в Chrome, Safari и Opera
      display: 'none',
    },
  },

  // Стиль для контейнера с горизонтальной прокруткой
  exchangeScrollContainerStyle: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
    scrollbarWidth: 'none', // Скрывает полосу прокрутки в Firefox
    msOverflowStyle: 'none', // Скрывает полосу прокрутки в IE/Edge
    '&::-webkit-scrollbar': { // Скрывает полосу прокрутки в Chrome, Safari и Opera
      display: 'none',
    },
  },

  // Стиль для контейнера колонок бирж
  exchangeColumnsContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    padding: '0 4px',
    minWidth: 'max-content',
  },

  // Стиль для колонки биржи
  exchangeColumnStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 620, // Ограничиваем высоту столбика
  },

  // Стиль для контейнера карточек биржи
  exchangeCardsContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto', // Добавляем вертикальную прокрутку
    scrollbarWidth: 'none', // Скрывает полосу прокрутки в Firefox
    msOverflowStyle: 'none', // Скрывает полосу прокрутки в IE/Edge
    '&::-webkit-scrollbar': { // Скрывает полосу прокрутки в Chrome, Safari и Opera
      display: 'none',
    },
  },

  // Стиль для карточки биржи (основной и дополнительной)
  exchangeCardStyle: {
    width: 360,
    height: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    position: 'relative',
    marginBottom: 1,
  },

  // Стиль для кнопок управления биржей
  exchangeButtonsContainerStyle: {
    display: 'flex',
    gap: 1,
  },

  // Стиль для инфо о дополнительном подключении
  instanceInfoContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
};