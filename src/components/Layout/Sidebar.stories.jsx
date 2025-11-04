import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Sidebar from './Sidebar';
import sidebarReducer from '@store/slices/sidebarSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
    },
    preloadedState: {
      sidebar: {
        isOpen: true,
        expandedMenus: [],
      },
      ...initialState,
    },
  });
};

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Provider store={createMockStore()}>
          <div style={{ display: 'flex', height: '100vh' }}>
            <Story />
          </div>
        </Provider>
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  args: {},
};

export const WithExpandedMenu = {
  decorators: [
    (Story) => {
      const store = createMockStore({
        sidebar: {
          isOpen: true,
          expandedMenus: ['dataModule'],
        },
      });
      return (
        <BrowserRouter>
          <Provider store={store}>
            <div style={{ display: 'flex', height: '100vh' }}>
              <Story />
            </div>
          </Provider>
        </BrowserRouter>
      );
    },
  ],
};

export const DarkTheme = {
  decorators: [
    (Story) => {
      document.documentElement.setAttribute('data-theme', 'dark');
      return (
        <BrowserRouter>
          <Provider store={createMockStore()}>
            <div style={{ display: 'flex', height: '100vh' }}>
              <Story />
            </div>
          </Provider>
        </BrowserRouter>
      );
    },
  ],
};

export const Closed = {
  decorators: [
    (Story) => {
      const store = createMockStore({
        sidebar: {
          isOpen: false,
          expandedMenus: [],
        },
      });
      return (
        <BrowserRouter>
          <Provider store={store}>
            <div style={{ display: 'flex', height: '100vh' }}>
              <Story />
            </div>
          </Provider>
        </BrowserRouter>
      );
    },
  ],
};
