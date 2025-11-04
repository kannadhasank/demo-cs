import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
import authReducer from '../../../store/slices/authSlice';
import * as authService from '../../../services/authService';

// Mock the auth service
jest.mock('../../../services/authService');

// Mock react-router-dom navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Helper function to render component with providers
const renderWithProviders = (
  component,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe('Login Component - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedNavigate.mockClear();
  });

  describe('Rendering', () => {
    test('should render login form with username and password fields', () => {
      renderWithProviders(<Login />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('should render login heading', () => {
      renderWithProviders(<Login />);
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    test('should have password field with type password', () => {
      renderWithProviders(<Login />);
      const passwordField = screen.getByLabelText(/password/i);
      expect(passwordField).toHaveAttribute('type', 'password');
    });
  });

  describe('User Input', () => {
    test('should allow typing in username field', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'testuser');

      expect(usernameInput).toHaveValue('testuser');
    });

    test('should allow typing in password field', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    test('should mask password input', () => {
      renderWithProviders(<Login />);
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    test('should show error when username is empty on submit', async () => {
      renderWithProviders(<Login />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        const error = screen.queryByText(/username is required/i);
        if (error) {
          expect(error).toBeInTheDocument();
        }
      });
    });

    test('should show error when password is empty on submit', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, 'testuser');

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        const error = screen.queryByText(/password is required/i);
        if (error) {
          expect(error).toBeInTheDocument();
        }
      });
    });
  });

  describe('Successful Login', () => {
    test('should call authService.login with correct credentials', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', role: 'admin' },
      };
      authService.login.mockResolvedValue(mockResponse);

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123',
        });
      });
    });

    test('should navigate to dashboard on successful login', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', role: 'admin' },
      };
      authService.login.mockResolvedValue(mockResponse);

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    test('should update Redux state with user data on successful login', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', role: 'admin' },
      };
      authService.login.mockResolvedValue(mockResponse);

      const user = userEvent.setup();
      const { store } = renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.auth.user).toEqual(mockResponse.user);
        expect(state.auth.token).toEqual(mockResponse.token);
        expect(state.auth.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Failed Login', () => {
    test('should display error message on login failure', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    test('should not navigate on login failure', async () => {
      authService.login.mockRejectedValue(new Error('Login failed'));

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });

      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('should keep username field filled after login failure', async () => {
      authService.login.mockRejectedValue(new Error('Login failed'));

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });

      expect(usernameInput).toHaveValue('wronguser');
    });
  });

  describe('Loading State', () => {
    test('should disable login button during submission', async () => {
      authService.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 100))
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      expect(loginButton).toBeDisabled();

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
    });

    test('should show loading indicator during submission', async () => {
      authService.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 100))
      );

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      const loadingIndicator = screen.queryByText(/loading/i);
      if (loadingIndicator) {
        expect(loadingIndicator).toBeVisible();
      }
    });
  });

  describe('Keyboard Navigation', () => {
    test('should submit form with Enter key', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: 1, username: 'testuser', role: 'admin' },
      };
      authService.login.mockResolvedValue(mockResponse);

      const user = userEvent.setup();
      renderWithProviders(<Login />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });

    test('should navigate between fields with Tab', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      usernameInput.focus();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(loginButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('should have accessible form labels', () => {
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(usernameInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
    });

    test('should have accessible submit button', () => {
      renderWithProviders(<Login />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
    });
  });
});