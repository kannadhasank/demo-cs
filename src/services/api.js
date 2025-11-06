import axios from 'axios';

// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden');
      }

      // Extract error message from various response formats
      const errorMessage =
        data?.message ||
        data?.error ||
        data?.title ||
        data?.errors?.[0] ||
        error.message ||
        'An error occurred';

      // Create error object with message
      const customError = new Error(errorMessage);
      customError.status = status;
      customError.data = data;

      return Promise.reject(customError);
    } else if (error.request) {
      // Request was made but no response received
      const customError = new Error(
        'No response from server. Please check your connection.'
      );
      return Promise.reject(customError);
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
