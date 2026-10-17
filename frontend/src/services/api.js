import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/TransferLK/backend/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

