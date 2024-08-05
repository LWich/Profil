// src/api/axiosInstance.js

import axios from 'axios';
import authStore from '../stores/authStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/', // Полный путь к внешнему API-серверу
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStore.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
