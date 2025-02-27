import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Check, Add } from '@mui/icons-material';
import { DeleteButton } from '../components/buttons/DeleteButton';
import { EditButton } from '../components/buttons/EditButton';
import { ConnectButton } from '../components/buttons/ConnectButton';
import { stylePersonalAccount } from '../style/components/style.personalAccount';

const {
  personalAccountContainerStyle, // Стиль для основного контейнера страницы
  exchangeScrollContainerStyle, // Стиль для контейнера с горизонтальной прокруткой
  exchangeColumnsContainerStyle, // Стиль для контейнера колонок бирж
  exchangeColumnStyle, // Стиль для колонки биржи
  exchangeCardsContainerStyle, // Стиль для контейнера карточек биржи
  exchangeCardStyle, // Стиль для карточки биржи (основной и дополнительной)
  exchangeButtonsContainerStyle, // Стиль для кнопок управления биржей
  instanceInfoContainerStyle, // Стиль для инфо о дополнительном подключении
} = stylePersonalAccount;

interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
}

interface ExchangeInstance extends Exchange {
  nickName: string;
  parentId: string;
}

const PersonalAccount: React.FC = () => {
  // Моковые данные бирж (надо создать БД под них и заменить на запросы)
  const [exchanges] = useState<Exchange[]>([
    {
      id: 'exchange_binance_01',
      name: 'Binance',
      isConnected: false,
    },
    {
      id: 'exchange_bybit_02',
      name: 'Bybit',
      isConnected: true,
    },
    {
      id: 'exchange_bybit_03',
      name: 'Кракен',
      isConnected: false,
    },
    {
      id: 'exchange_bybit_04',
      name: 'Йобит',
      isConnected: false,
    },
    {
      id: 'exchange_Йобит_05',
      name: 'Trust',
      isConnected: false,
    },
    {
      id: 'exchange_BitCap_06',
      name: 'BitCap',
      isConnected: false,
    },
  ]);

  const [instances, setInstances] = useState<ExchangeInstance[]>([]);

  // Моковые обработчики событий для кнопок карточки
  // TODO: Добавить интеграцию с API биржи для получения и обновления ключей
  const handleEditApiExchange = (id: string) => {
    console.log('Редактирование биржи:', id);
  };

  // TODO: Реализовать удаление API ключей из БД и отключение от WebSocket
  const handleDeleteConnectExchange = (id: string) => {
    console.log('Удаление биржи:', id);
  };

  // TODO: Добавить форму для ввода API ключей и их сохранение в БД
  const handleConnectExchange = (id: string) => {
    console.log('Подключение биржи:', id);
  };

  // Обработчик добавления нового экземпляра подключения
  const handleAddMoreApiConnection = (parentId: string) => {
    const parent = exchanges.find(e => e.id === parentId);
    if (!parent) return;

    const newInstance: ExchangeInstance = {
      id: `${parentId}_instance_${Date.now()}`,
      parentId,
      name: parent.name,
      nickName: `${parent.name} ${instances.filter(i => i.parentId === parentId).length + 1}`,
      isConnected: false,
    };

    setInstances(prev => [...prev, newInstance]);
  };

  // Получаем уникальные имена бирж
  const exchangeNames = [...new Set(exchanges.map(exchange => exchange.name))];

  return (
    // Box #1: Главный контейнер для всей страницы
    <Box
      id="personal-account-container"
      sx={personalAccountContainerStyle}
    >
      {/* Заголовок страницы */}
      <Typography variant="h6" sx={{ pt: 2, mb: 2 }}>
        Доступные биржи для подключения
      </Typography>

      {/* Box #2: Контейнер фиксированной ширины с горизонтальной прокруткой */}
      <Box
        id="exchange-scroll-container"
        sx={exchangeScrollContainerStyle}
      >
        {/* Box #3: Контейнер для всех колонок бирж */}
        <Box
          id="exchange-columns-container"
          sx={exchangeColumnsContainerStyle}
        >
          {/* Динамическое создание колонок для каждой биржи */}
          {exchangeNames.map(exchangeName => {
            const exchangesOfType = exchanges.filter(exchange => exchange.name === exchangeName);
            const instancesOfType = instances.filter(instance => instance.name === exchangeName);

            return (
              // Box #3: Контейнер для колонки одной биржи
              <>
                <Box
                  id={`exchange-column-${exchangeName}`}
                  key={exchangeName}
                  sx={exchangeColumnStyle}
                >
                  <Box id={`exchange-title-container-${exchangeName}`}>
                    <Typography id={`exchange-title-${exchangeName}`} variant="subtitle1" sx={{ mb: 1 }}>{exchangeName}</Typography>
                  </Box>
                  <Box
                    id={`exchange-cards-container-${exchangeName}`}
                    sx={exchangeCardsContainerStyle}
                  >
                    {exchangesOfType.map(exchange => (
                      // Box #4: Контейнер для карточки основного подключения биржи
                      <Box key={exchange.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Paper #1: Карточка основного подключения биржи */}
                        <Paper
                          id={`exchange-card-${exchange.id}`}
                          sx={exchangeCardStyle}
                        >
                          {/* Название биржи */}
                          <Typography>{exchange.name}</Typography>
                          {/* Box #5: Контейнер для кнопок управления биржей */}
                          <Box sx={exchangeButtonsContainerStyle}>
                            {exchange.isConnected ? (
                              <>
                                {/* Чип, сигнализирующий о статусе подключения */}
                                <Chip
                                  icon={<Check />}
                                  label="Подключено"
                                  color="success"
                                />
                                {/* Кнопки для редактирования и удаления подключения */}
                                <EditButton
                                  id={`edit-btn-${exchange.id}`}
                                  onClick={() => handleEditApiExchange(exchange.id)}
                                />
                                <DeleteButton
                                  id={`delete-btn-${exchange.id}`}
                                  onClick={() => handleDeleteConnectExchange(exchange.id)}
                                />
                              </>
                            ) : (
                              /* Кнопка для подключения биржи */
                              <ConnectButton
                                id={`connect-btn-${exchange.id}`}
                                onClick={() => handleConnectExchange(exchange.id)}
                              />
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    ))}

                    {instancesOfType.map((instance) => (
                      // Box #6: Контейнер для карточки дополнительного подключения
                      <Box key={instance.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Paper #2: Карточка дополнительного подключения биржи */}
                        <Paper
                          id={`instance-card-${instance.id}`}
                          sx={exchangeCardStyle}
                        >
                          {/* Box #7: Контейнер для информации о дополнительном подключении */}
                          <Box sx={instanceInfoContainerStyle}>
                            {/* Название биржи */}
                            <Typography>{instance.name}</Typography>
                            {/* Пользовательское имя подключения */}
                            <Typography variant="caption" color="textSecondary">
                              {instance.nickName}
                            </Typography>
                          </Box>
                          {instance.isConnected ? (
                            // Box #8: Контейнер для кнопок управления дополнительным подключением
                            <Box sx={exchangeButtonsContainerStyle}>
                              {/* Чип, сигнализирующий о статусе подключения */}
                              <Chip
                                id={`connected-chip-${instance.id}`}
                                icon={<Check />}
                                label="Подключено"
                                color="success"
                              />
                              {/* Кнопки для редактирования и удаления подключения */}
                              <EditButton
                                id={`edit-btn-${instance.id}`}
                                onClick={() => handleEditApiExchange(instance.id)}
                              />
                              <DeleteButton
                                id={`delete-btn-${instance.id}`}
                                onClick={() => handleDeleteConnectExchange(instance.id)}
                              />
                            </Box>
                          ) : (
                            /* Кнопка для подключения дополнительного экземпляра биржи */
                            <ConnectButton
                              id={`connect-btn-${instance.id}`}
                              onClick={() => handleConnectExchange(instance.id)}
                            />
                          )}
                        </Paper>
                      </Box>
                    ))}

                    {/* Добавляем плюсик в конце каждой колонки для создания нового подключения */}
                    {(exchangesOfType.length > 0 || instancesOfType.length > 0) && (
                      <IconButton
                        id={`add-instance-btn-${exchangeName}`}
                        size="small"
                        sx={{ alignSelf: 'center', marginTop: -1 }}
                        onClick={() => handleAddMoreApiConnection(
                          instancesOfType.length > 0
                            ? instancesOfType[0].parentId
                            : exchangesOfType[0].id,
                        )}
                        title="Добавить еще одно подключение"
                      >
                        <Add />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalAccount;