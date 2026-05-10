import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.replace('/login?expired=1');
    }
    
    if (error.response && error.response.data instanceof Blob) {
      return error.response.data.text().then(text => {
        error.message = text || 'An unexpected error occurred';
        return Promise.reject(error);
      });
    }

    // Extract error message
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data) {
      message = error.response.data.message || error.response.data.error || message;
    } else if (error.message) {
      message = error.message;
    }
    
    error.message = message;
    return Promise.reject(error);
  }
);

export default apiClient;
