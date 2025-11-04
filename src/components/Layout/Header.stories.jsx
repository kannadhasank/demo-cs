import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '@store/slices/authSlice';
import themeReducer from '@store/slices/themeSlice';
import sidebarReducer from '@store/slices/sidebarSlice';

// Create a mock store for Storybook
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      sidebar: sidebarReducer,
    },
    preloadedState: {
      auth: {
        user: { name: 'John Smith', email: 'john@example.com' },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
      },
      theme: {
        theme: 'light',
      },
      sidebar: {
        isOpen: true,
        expandedMenus: [],
      },
      ...initialState,
    },
  });
};

export default {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Provider store={createMockStore()}>
          <Story />
        </Provider>
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  args: {},
};

export const WithDarkTheme = {
  decorators: [
    (Story) => {
      // Set dark theme for this story
      const store = createMockStore({
        theme: { theme: 'dark' },
      });
      document.documentElement.setAttribute('data-theme', 'dark');
      return (
        <BrowserRouter>
          <Provider store={store}>
            <Story />
          </Provider>
        </BrowserRouter>
      );
    },
  ],
};

export const DifferentUser = {
  decorators: [
    (Story) => {
      const store = createMockStore({
        auth: {
          user: { name: 'Jane Doe', email: 'jane@example.com' },
          token: 'mock-token',
          isAuthenticated: true,
          isLoading: false,
          isError: false,
          isSuccess: false,
          message: '',
        },
      });
      return (
        <BrowserRouter>
          <Provider store={store}>
            <Story />
          </Provider>
        </BrowserRouter>
      );
    },
  ],
};
