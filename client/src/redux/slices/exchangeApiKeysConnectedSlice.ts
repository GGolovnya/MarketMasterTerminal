import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getApiKeysInfo,
  addApiKey,
  updateApiKey,
  deleteApiKey,
} from '../thunks/exchangeApiKeysConnectedThunks';

// Интерфейс для API ключа, соответствующий структуре в базе данных
export interface ApiKey {
  id: number;
  exchangeName: string;
  nickName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Без полей с зашифрованными данными, которые не должны возвращаться на фронтенд
}

// Состояние слайса для работы с API ключами
interface ExchangeApiKeysConnectedState {
  // Информация о статусе подключения ключей
  connectedKeys: {
    exchangeId: string;    // Идентификатор биржи
    apiKey: string;        // API ключ (частичный, для идентификации)
    isConnected: boolean;  // Статус подключения
    lastChecked: string;   // Время последней проверки
  }[];
  apiKeys: ApiKey[];       // Список API ключей пользователя
  status: 'idle' | 'loading' | 'succeeded' | 'failed';  // Статус операций
  error: string | null;    // Сообщение об ошибке
}

// Начальное состояние
const initialState: ExchangeApiKeysConnectedState = {
  connectedKeys: [],
  apiKeys: [],
  status: 'idle',
  error: null,
};

// Создание слайса для управления API ключами бирж
const exchangeApiKeysConnectedSlice = createSlice({
  name: 'exchangeApiKeysConnected',
  initialState,
  reducers: {
    // Сброс состояния соединения
    resetConnectionState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    // Установка статуса подключения ключа
    setKeyConnected: (state, action: PayloadAction<{exchangeId: string, apiKey: string, isConnected: boolean}>) => {
      const { exchangeId, apiKey, isConnected } = action.payload;
      const existingKeyIndex = state.connectedKeys.findIndex(
        key => key.exchangeId === exchangeId && key.apiKey === apiKey,
      );

      if (existingKeyIndex >= 0) {
        // Обновление существующей записи
        state.connectedKeys[existingKeyIndex].isConnected = isConnected;
        state.connectedKeys[existingKeyIndex].lastChecked = new Date().toISOString();
      } else {
        // Добавление новой записи
        state.connectedKeys.push({
          exchangeId,
          apiKey,
          isConnected,
          lastChecked: new Date().toISOString(),
        });
      }
    },
  },
  // Обработка асинхронных операций с помощью extraReducers
  extraReducers: (builder) => {
    builder
      // Обработка получения информации об API ключах
      .addCase(getApiKeysInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getApiKeysInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apiKeys = action.payload;
      })
      .addCase(getApiKeysInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Обработка добавления нового API ключа
      .addCase(addApiKey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addApiKey.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apiKeys.push(action.payload);
      })
      .addCase(addApiKey.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Обработка обновления API ключа
      .addCase(updateApiKey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApiKey.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.apiKeys.findIndex(key => key.id === action.payload.id);
        if (index !== -1) {
          state.apiKeys[index] = action.payload;
        }
      })
      .addCase(updateApiKey.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Обработка удаления API ключа
      .addCase(deleteApiKey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.apiKeys = state.apiKeys.filter(key => key.id !== action.payload);
      })
      .addCase(deleteApiKey.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetConnectionState, setKeyConnected } = exchangeApiKeysConnectedSlice.actions;

export default exchangeApiKeysConnectedSlice.reducer;