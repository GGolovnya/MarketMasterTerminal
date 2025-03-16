import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const getApiKeysInfo = createAsyncThunk(
  'exchangeApiKeys/getApiKeysInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/exchange-keys/');
      // Обработка данных, чтобы гарантировать наличие isActive
      const processedData = response.data.map(key => ({
        ...key,
        isActive: key.isActive !== undefined ? key.isActive : false, // Значение по умолчанию false
      }));

      return processedData;
    } catch (error) {
      return rejectWithValue('Не удалось загрузить информацию об API ключах');
    }
  },
);

export const addApiKey = createAsyncThunk(
  'exchangeApiKeys/add',
  async (data: { exchangeName: string; apiKey: string; apiSecret: string; nickName: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/exchange-keys', data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Не удалось добавить API ключ');
    }
  },
);

export const updateApiKey = createAsyncThunk(
  'exchangeApiKeys/update',
  async (data: {
    id: number;
    apiKey?: string;
    apiSecret?: string;
    nickName?: string
    }, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const response = await axiosInstance.put(`/api/exchange-keys/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Не удалось обновить API ключ');
    }
  },
);

export const deleteApiKey = createAsyncThunk(
  'exchangeApiKeys/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/exchange-keys/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Не удалось удалить API ключ');
    }
  },
);
