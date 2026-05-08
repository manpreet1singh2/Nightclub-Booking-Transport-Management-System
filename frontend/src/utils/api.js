import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Restore token on load
const stored = localStorage.getItem('nightvibe-auth');
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    if (state?.token) api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
  } catch {}
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('nightvibe-auth');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login') window.location.href = '/login';
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
