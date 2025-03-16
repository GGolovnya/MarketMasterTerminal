import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Check, Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { stylePersonalAccount } from '../style/components/style.personalAccount';
import { DeleteButton } from '../components/buttons/DeleteButton';
import { EditButton } from '../components/buttons/EditButton';
import { ConnectButton } from '../components/buttons/ConnectButton';
import ApiKeyForm from '../components/PersonalAccount/forms/ApiKeyForm';
import { getAvailableExchanges, Exchange } from '../components/PersonalAccount/availableExchanges';
import { RootState } from '../redux/store';
import { getApiKeysInfo, addApiKey, updateApiKey, deleteApiKey } from '../redux/thunks/exchangeApiKeysConnectedThunks';

// Стили
const {
  personalAccountContainerStyle,
  exchangeScrollContainerStyle,
  exchangeColumnsContainerStyle,
  exchangeColumnStyle,
  exchangeCardsContainerStyle,
  exchangeCardStyle,
  exchangeButtonsContainerStyle,
  instanceInfoContainerStyle,
} = stylePersonalAccount;

// Интерфейсы
interface ExchangeInstance extends Exchange {
  nickName: string;
  parentId: string;
}

interface FormState {
  isOpen: boolean;
  exchangeId: string | null;
  exchangeName: string;
  isEdit: boolean;
  initialData: {
    apiKey: string;
    apiSecret: string;
    nickName: string;
  };
}

const PersonalAccount: React.FC = () => {
  const dispatch = useDispatch();

  // Состояние для доступных бирж, которое можно обновлять
  const [memoizedAvailableExchanges, setMemoizedAvailableExchanges] = useState(() => getAvailableExchanges());

  // Получение ключей API из Redux
  const { apiKeys, status } = useSelector((state: RootState) => state.exchangeApiKeys);

  // Локальное состояние для управления интерфейсом
  const [instances, setInstances] = useState<ExchangeInstance[]>([]);
  const [formsState, setFormsState] = useState<Record<string, FormState>>({});

  // Загрузка ключей API при монтировании компонента
  useEffect(() => {
    dispatch(getApiKeysInfo() as any);
  }, [dispatch]);

  // Обновление состояния isConnected для availableExchanges на основе данных из Redux
  useEffect(() => {
    if (apiKeys.length > 0) {
    // Создаем копию доступных бирж для обновления
      const updatedAvailableExchanges = [...memoizedAvailableExchanges];

      // Для каждого ключа API из Redux обновляем соответствующую биржу
      apiKeys.forEach(key => {
        const matchingExchangeIndex = updatedAvailableExchanges.findIndex(
          ex => ex.name === key.exchangeName,
        );

        if (matchingExchangeIndex !== -1) {
        // Обновляем статус подключения с проверкой наличия isActive
          updatedAvailableExchanges[matchingExchangeIndex] = {
            ...updatedAvailableExchanges[matchingExchangeIndex],
            isConnected: key.isActive === undefined ? false : key.isActive,
          };
        }
      });

      // Обновляем мемоизированное значение
      setMemoizedAvailableExchanges(updatedAvailableExchanges);

      // Создаем экземпляры для отображения
      const newInstances = apiKeys.map((key) => ({
        id: `db_${key.id}`,
        parentId: updatedAvailableExchanges.find(e => e.name === key.exchangeName)?.id || '',
        name: key.exchangeName,
        nickName: key.nickName,
        isConnected: key.isActive === undefined ? false : key.isActive,
      }));
      setInstances(newInstances);
    }
  }, [apiKeys]);

  // Обработчик редактирования API ключа
  const handleEditApiExchange = (id: string) => {
    console.log('Редактирование биржи:', id);

    // Проверяем, это экземпляр из БД или базовая биржа
    const instanceExchange = instances.find(inst => inst.id === id);
    const basicExchange = memoizedAvailableExchanges.find(ex => ex.id === id);

    // Используем найденный объект
    const exchange = instanceExchange || basicExchange;

    if (exchange) {
      setFormsState(prev => ({
        ...prev,
        [id]: {
          isOpen: true,
          exchangeId: id,
          exchangeName: exchange.name,
          isEdit: true,
          initialData: {
            apiKey: '********',
            apiSecret: '********',
            nickName: instanceExchange ? instanceExchange.nickName : exchange.name,
          },
        },
      }));
    }
  };

  // Обработчик удаления подключения биржи
  const handleDeleteConnectExchange = (id: string) => {
    console.log('Удаление биржи:', id);

    // Если это запись из БД (id начинается с 'db_')
    if (id.startsWith('db_')) {
      const dbId = parseInt(id.substring(3), 10);
      dispatch(deleteApiKey(dbId) as any);

      // Обновляем состояние базовой биржи при удалении подключения
      const instanceToDelete = instances.find(inst => inst.id === id);
      if (instanceToDelete) {
        setMemoizedAvailableExchanges(prev =>
          prev.map(exchange =>
            exchange.name === instanceToDelete.name
              ? { ...exchange, isConnected: false }
              : exchange,
          ),
        );
      }
    } else {
      // Удаление локального экземпляра
      setInstances(prev => prev.filter(inst => inst.id !== id));
    }
  };

  // Обработчик подключения биржи
  const handleConnectExchange = (id: string) => {
    console.log('Подключение биржи:', id);

    // Проверяем, это экземпляр или базовая биржа
    const instanceExchange = instances.find(inst => inst.id === id);
    const basicExchange = memoizedAvailableExchanges.find(ex => ex.id === id);

    // Используем найденный объект
    const exchange = instanceExchange || basicExchange;

    if (exchange) {
      setFormsState(prev => ({
        ...prev,
        [id]: {
          isOpen: true,
          exchangeId: id,
          exchangeName: exchange.name,
          isEdit: false,
          initialData: {
            apiKey: '',
            apiSecret: '',
            nickName: instanceExchange ? instanceExchange.nickName : exchange.name,
          },
        },
      }));
    }
  };

  // Функция для закрытия формы
  const handleCloseForm = (id: string) => {
    setFormsState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
  };

  // Функция для обработки отправки формы
  const handleSubmitApiKeys = (id: string, formData: any) => {
    // Если это запись из БД (id начинается с 'db_')
    if (id.startsWith('db_')) {
      const dbId = parseInt(id.substring(3), 10);
      dispatch(updateApiKey({
        id: dbId,
        apiKey: formData.apiKey !== '********' ? formData.apiKey : undefined,
        apiSecret: formData.apiSecret !== '********' ? formData.apiSecret : undefined,
        nickName: formData.nickName,
      }) as any);
    } else {
      // Это новое подключение биржи
      dispatch(addApiKey({
        exchangeName: formData.exchangeName || formsState[id].exchangeName,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        nickName: formData.nickName,
      }) as any);

      // Обновляем состояние базовой биржи при успешном подключении
      if (id.startsWith('exchange_')) {
        setMemoizedAvailableExchanges(prev =>
          prev.map(exchange =>
            exchange.id === id
              ? { ...exchange, isConnected: true }
              : exchange,
          ),
        );
      }
    }

    // Закрываем форму после отправки
    setFormsState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
  };

  // Обработчик добавления нового экземпляра подключения
  const handleAddMoreApiConnection = (parentId: string) => {
    const parent = memoizedAvailableExchanges.find(e => e.id === parentId);
    if (!parent) return;

    const newInstance: ExchangeInstance = {
      id: `new_${parentId}_${Date.now()}`,
      parentId,
      name: parent.name,
      nickName: `${parent.name} ${instances.filter(i => i.parentId === parentId).length + 1}`,
      isConnected: false,
    };

    setInstances(prev => [...prev, newInstance]);
  };

  // Получаем уникальные имена бирж
  const exchangeNames = [...new Set(memoizedAvailableExchanges.map(exchange => exchange.name))];

  // Определяем существующие записи для каждой биржи в БД
  const exchangesByName: Record<string, {
    baseExchanges: Exchange[],
    dbInstances: ExchangeInstance[],
    newInstances: ExchangeInstance[]
  }> = {};

  exchangeNames.forEach(name => {
    // Находим базовые биржи с этим именем
    const baseExchanges = memoizedAvailableExchanges.filter(ex => ex.name === name);

    // Находим экземпляры из БД для этой биржи
    const dbInstances = instances.filter(inst =>
      inst.name === name && inst.id.startsWith('db_'),
    );

    // Находим новые локальные экземпляры для этой биржи
    const newInstances = instances.filter(inst =>
      inst.name === name && !inst.id.startsWith('db_'),
    );

    exchangesByName[name] = { baseExchanges, dbInstances, newInstances };
  });

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

      {/* Индикатор загрузки, если данные загружаются */}
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

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
            const { baseExchanges, dbInstances, newInstances } = exchangesByName[exchangeName];

            // Показываем базовую биржу только если нет данных из БД для этой биржи
            const baseExchangesToShow = dbInstances.length === 0 ? baseExchanges : [];

            return (
              // Box #3: Контейнер для колонки одной биржи
              <React.Fragment key={exchangeName}>
                <Box
                  id={`exchange-column-${exchangeName}`}
                  sx={exchangeColumnStyle}
                >
                  <Box id={`exchange-title-container-${exchangeName}`}>
                    <Typography id={`exchange-title-${exchangeName}`} variant="subtitle1" sx={{ mb: 1 }}>{exchangeName}</Typography>
                  </Box>
                  <Box
                    id={`exchange-cards-container-${exchangeName}`}
                    sx={exchangeCardsContainerStyle}
                  >
                    {/* Отображаем базовые биржи, если нет записей в БД */}
                    {baseExchangesToShow.map(exchange => (
                      <Box key={exchange.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Paper
                          id={`exchange-card-${exchange.id}`}
                          sx={exchangeCardStyle}
                        >
                          <Box sx={instanceInfoContainerStyle}>
                            <Typography>{exchange.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              Основное подключение
                            </Typography>
                          </Box>
                          <Box sx={exchangeButtonsContainerStyle}>
                            {exchange.isConnected ? (
                              <>
                                <Chip
                                  icon={<Check />}
                                  label="Подключено"
                                  color="success"
                                />
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
                              <ConnectButton
                                id={`connect-btn-${exchange.id}`}
                                onClick={() => handleConnectExchange(exchange.id)}
                              />
                            )}
                          </Box>
                        </Paper>

                        {/* Форма API ключей */}
                        {formsState[exchange.id] && (
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ width: '100%', maxWidth: exchangeCardStyle.width }}>
                              <ApiKeyForm
                                isOpen={formsState[exchange.id].isOpen}
                                exchangeName={formsState[exchange.id].exchangeName}
                                onClose={() => handleCloseForm(exchange.id)}
                                onSubmit={(formData) => handleSubmitApiKeys(exchange.id, formData)}
                                initialNickName={formsState[exchange.id].initialData.nickName}
                                initialApiKey={formsState[exchange.id].initialData.apiKey}
                                initialApiSecret={formsState[exchange.id].initialData.apiSecret}
                                isEdit={formsState[exchange.id].isEdit}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}

                    {/* Отображаем экземпляры из БД */}
                    {dbInstances.map((instance) => (
                      <Box key={instance.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Paper
                          id={`instance-card-${instance.id}`}
                          sx={exchangeCardStyle}
                        >
                          <Box sx={instanceInfoContainerStyle}>
                            <Typography>{instance.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {instance.nickName}
                            </Typography>
                          </Box>
                          <Box sx={exchangeButtonsContainerStyle}>
                            {instance.isConnected ? (
                              <>
                                <Chip
                                  id={`connected-chip-${instance.id}`}
                                  icon={<Check />}
                                  label="Подключено"
                                  color="success"
                                />
                                <EditButton
                                  id={`edit-btn-${instance.id}`}
                                  onClick={() => handleEditApiExchange(instance.id)}
                                />
                                <DeleteButton
                                  id={`delete-btn-${instance.id}`}
                                  onClick={() => handleDeleteConnectExchange(instance.id)}
                                />
                              </>
                            ) : (
                              <ConnectButton
                                id={`connect-btn-${instance.id}`}
                                onClick={() => handleConnectExchange(instance.id)}
                              />
                            )}
                          </Box>
                        </Paper>

                        {/* Форма API ключей */}
                        {formsState[instance.id] && (
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ width: '100%', maxWidth: exchangeCardStyle.width }}>
                              <ApiKeyForm
                                isOpen={formsState[instance.id].isOpen}
                                exchangeName={formsState[instance.id].exchangeName}
                                onClose={() => handleCloseForm(instance.id)}
                                onSubmit={(formData) => handleSubmitApiKeys(instance.id, formData)}
                                initialNickName={formsState[instance.id].initialData.nickName}
                                initialApiKey={formsState[instance.id].initialData.apiKey}
                                initialApiSecret={formsState[instance.id].initialData.apiSecret}
                                isEdit={formsState[instance.id].isEdit}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}

                    {/* Отображаем новые экземпляры (не из БД) */}
                    {newInstances.map((instance) => (
                      <Box key={instance.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Paper
                          id={`instance-card-${instance.id}`}
                          sx={exchangeCardStyle}
                        >
                          <Box sx={instanceInfoContainerStyle}>
                            <Typography>{instance.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {instance.nickName}
                            </Typography>
                          </Box>
                          <Box sx={exchangeButtonsContainerStyle}>
                            {instance.isConnected ? (
                              <>
                                <Chip
                                  id={`connected-chip-${instance.id}`}
                                  icon={<Check />}
                                  label="Подключено"
                                  color="success"
                                />
                                <EditButton
                                  id={`edit-btn-${instance.id}`}
                                  onClick={() => handleEditApiExchange(instance.id)}
                                />
                                <DeleteButton
                                  id={`delete-btn-${instance.id}`}
                                  onClick={() => handleDeleteConnectExchange(instance.id)}
                                />
                              </>
                            ) : (
                              <ConnectButton
                                id={`connect-btn-${instance.id}`}
                                onClick={() => handleConnectExchange(instance.id)}
                              />
                            )}
                          </Box>
                        </Paper>

                        {/* Форма API ключей */}
                        {formsState[instance.id] && (
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ width: '100%', maxWidth: exchangeCardStyle.width }}>
                              <ApiKeyForm
                                isOpen={formsState[instance.id].isOpen}
                                exchangeName={formsState[instance.id].exchangeName}
                                onClose={() => handleCloseForm(instance.id)}
                                onSubmit={(formData) => handleSubmitApiKeys(instance.id, formData)}
                                initialNickName={formsState[instance.id].initialData.nickName}
                                initialApiKey={formsState[instance.id].initialData.apiKey}
                                initialApiSecret={formsState[instance.id].initialData.apiSecret}
                                isEdit={formsState[instance.id].isEdit}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}

                    {/* Кнопка добавления нового подключения */}
                    {(baseExchangesToShow.length > 0 || dbInstances.length > 0 || newInstances.length > 0) && (
                      <IconButton
                        id={`add-instance-btn-${exchangeName}`}
                        size="small"
                        sx={{ alignSelf: 'center', marginTop: -1 }}
                        onClick={() => handleAddMoreApiConnection(
                          dbInstances.length > 0
                            ? dbInstances[0].parentId
                            : baseExchangesToShow.length > 0
                              ? baseExchangesToShow[0].id
                              : newInstances[0].parentId,
                        )}
                        title="Добавить еще одно подключение"
                      >
                        <Add />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalAccount;