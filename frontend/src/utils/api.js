import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';

    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('nightvibe-auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
