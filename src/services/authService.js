import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Mock data for development
const MOCK_USER = {
  id: 1,
  name: 'John Smith',
  email: 'john.smith@csdb.com',
  role: 'admin',
};

// Generate a mock JWT token
const generateMockToken = (user) => {
  // This is a mock token - in production, this comes from the backend
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };
  
  // Mock token (not a real JWT, just for demonstration)
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
};

// Login user
const login = async (userData) => {
  // TODO: Replace with actual API call
  // const response = await axios.post('/api/auth/login', userData);
  
  // Mock login logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        const token = generateMockToken(MOCK_USER);
        const user = MOCK_USER;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        resolve({ user, token });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

// Register user
const register = async (userData) => {
  // TODO: Replace with actual API call
  // const response = await axios.post('/api/auth/register', userData);
  
  // Mock register logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password && userData.name) {
        const user = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'user',
        };
        const token = generateMockToken(user);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        resolve({ user, token });
      } else {
        reject(new Error('Registration failed'));
      }
    }, 1000);
  });
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
  register,
  logout,
  getCurrentUser,
  verifyToken,
};

export default authService;
