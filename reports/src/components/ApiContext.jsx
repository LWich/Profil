// src/contexts/ApiContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [apiEndpoints, setApiEndpoints] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApiEndpoints = async () => {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token); // Для отладки

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        const axiosInstance = axios.create({
          baseURL: 'http://localhost:8000/api/v1', // Полный путь к внешнему API-серверу
        });
        const response = await axiosInstance.get('/');
        console.log('API Response:', response.data); // Для отладки
        setApiEndpoints(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Fetch Error:', err); // Для отладки
        setError('Failed to fetch API endpoints');
        setLoading(false);
      }
    };

    fetchApiEndpoints();
  }, []);

  return (
    <ApiContext.Provider value={{ apiEndpoints, setApiEndpoints, loading, error }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
