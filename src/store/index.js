import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import sidebarReducer from './slices/sidebarSlice';
import cageReducer from './slices/cageSlice';
import endItemReducer from './slices/endItemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    sidebar: sidebarReducer,
    cage: cageReducer,
    endItem: endItemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
