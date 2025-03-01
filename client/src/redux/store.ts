import { configureStore } from '@reduxjs/toolkit';
import exchangeApiKeysConnectedReducer from './slices/exchangeApiKeysConnectedSlice';

export const store = configureStore({
  reducer: {
    exchangeApiKeys: exchangeApiKeysConnectedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;