import axios from 'axios';

// Resolves API URL based on environment or host:
// 1. Explicit VITE_API_BASE_URL (from .env or .env.production)
// 2. Production domain (https://transferlk.pearlwaves.online/backend/api)
// 3. Local dev fallback (http://localhost/TransferLK/backend/api)
const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'transferlk.pearlwaves.online') {
    return 'https://transferlk.pearlwaves.online/backend/api';
  }
  return 'http://localhost/TransferLK/backend/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
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

