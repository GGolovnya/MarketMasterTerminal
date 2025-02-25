import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { DeleteButton } from '../components/buttons/DeleteButton';
import { EditButton } from '../components/buttons/EditButton';
import { ConnectButton } from '../components/buttons/ConnectButton';

interface Exchange {
  id: string;
  name: string;
  isConnected: boolean;
}

const PersonalAccount: React.FC = () => {
  //Моковые данные бирж (надо создать БД под них и заменить на запросы)
  const exchanges: Exchange[] = [
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
  ];

  //Моковые обработчики событий для кнопок карточки
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

  return (
    <Container maxWidth={false}>
      {exchanges.map((exchange) => (
        <Paper
          key={exchange.id}
          sx={{
            width: 360,
            height: 100,
            marginTop: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Typography>{exchange.name}</Typography>
          {exchange.isConnected ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<Check />}
                label="Подключено"
                color="success"
              />
              <EditButton onClick={() => handleEditApiExchange(exchange.id)} />
              <DeleteButton onClick={() => handleDeleteConnectExchange(exchange.id)} />
            </Box>
          ) : (
            <ConnectButton onClick={() => handleConnectExchange(exchange.id)} />
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default PersonalAccount;