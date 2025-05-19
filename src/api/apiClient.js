import axios from 'axios';
import createAuthClient from './authClient';              // ← CHANGED: импорт AUTH-клиента

// ← ADDED: создаём один экземпляр для всех защищённых запросов
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,          // http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' },
});

// ← ADDED: добавляем accessToken в каждый запрос
API.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH = createAuthClient();                        // ← ADDED: чистый клиент для /auth

// ← ADDED: ответный интерсептор — ловим 401/expired и делаем refresh
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const status  = error.response?.status;
    const message = error.response?.data?.message;

    if (
      (status === 401 || message === 'Invalid or expired token') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data: refreshRes } = await AUTH.post('/refresh', { refreshToken });
        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch {
        // если рефреш не удался — на логин
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
