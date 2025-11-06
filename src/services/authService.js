import api from './api';
import { jwtDecode } from 'jwt-decode';

// Login user
const login = async (userData) => {
  try {
    // Call backend login API
    const response = await api.post('/Auth/login', {
      username: userData.email || userData.username,
      password: userData.password,
    });

    // Extract data from backend response
    const { token, username, email, expiresAt } = response.data;

    // Decode JWT token to extract claims
    const decoded = jwtDecode(token);

    // Create user object from token claims and response
    const user = {
      id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      name: username,
      email: email,
      username: username,
      expiresAt: expiresAt,
    };

    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  } catch (error) {
    // Clear any existing auth data on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Re-throw error with message
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return Promise.resolve();
};

// Get current user
const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      return {
        user: JSON.parse(user),
        token,
      };
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const authService = {
  login,
  logout,
  getCurrentUser,
  verifyToken,
};

export default authService;
