import axios from 'axios';

// Configure API instance with environment-aware settings
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  timeout: 10000
});

// Secure request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (using secure HTTP-only cookies is preferred)
    const token = localStorage.getItem('authToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF protection if needed
    const csrfToken = getCSRFToken(); // Implement this based on your auth setup
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    // You might want to validate the response structure here
    if (response.data?.success === false) {
      return Promise.reject(response.data);
    }
    return response.data;
  },
  (error) => {
    // Centralized error handling
    const errorResponse = {
      status: error.response?.status || 0,
      message: '',
      data: error.response?.data || null,
      isNetworkError: !error.response
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.message = 
        error.response.data?.message ||
        getErrorMessageForStatus(error.response.status) ||
        'Request failed';

      // Special handling for auth errors
      if (error.response.status === 401) {
        handleUnauthorized();
      }
      if (error.response.status === 403) {
        handleForbidden();
      }
    } else if (error.request) {
      // Request was made but no response
      errorResponse.message = 'Network error - please check your connection';
    } else {
      // Request setup error
      errorResponse.message = error.message || 'Request configuration error';
    }

    console.error('API Error:', errorResponse.message);
    return Promise.reject(errorResponse);
  }
);

// Helper functions
function getErrorMessageForStatus(status) {
  const messages = {
    400: 'Invalid request',
    401: 'Session expired - please login again',
    403: 'You don\'t have permission for this action',
    404: 'Resource not found',
    500: 'Server error',
    503: 'Service unavailable'
  };
  return messages[status] || `HTTP error ${status}`;
}

function handleUnauthorized() {
  // Clear sensitive data
  localStorage.removeItem('authToken');
  // Redirect to login with return URL
  const currentPath = window.location.pathname;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
}

function handleForbidden() {
  // You might want to show a special forbidden page
  window.location.href = '/forbidden';
}

export default api;